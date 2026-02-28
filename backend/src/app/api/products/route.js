import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const category = searchParams.get("category")
        const search = searchParams.get("search")
        const featured = searchParams.get("featured") === "true"
        const hasDiscount = searchParams.get("discount") === "true"
        const sort = searchParams.get("sort") || "newest"

        const skip = (page - 1) * limit

        let where = {}
        if (category) {
            where.category = { slug: category }
        }
        if (featured) {
            where.featured = true
        }
        if (hasDiscount) {
            // Filter products where at least one variant has a price lower than originalPrice
            where.variants = {
                some: {
                    originalPrice: {
                        gt: 0 // We can't easily compare originalPrice > price in Prisma where, 
                        // but we can at least filter variants that HAVE an originalPrice set
                    }
                }
            }
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        let orderBy = {}
        if (sort === "price-low") {
            orderBy = { variants: { _count: 'asc' } }
        } else if (sort === "price-high") {
            orderBy = { variants: { _count: 'desc' } }
        } else if (sort === "name-az") {
            orderBy = { name: 'asc' }
        } else {
            orderBy = { createdAt: 'desc' }
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    variants: true,
                    images: true
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ])

        return NextResponse.json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Products GET error:", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validated = productSchema.parse(body)

        const product = await prisma.$transaction(async (tx) => {
            const newProduct = await tx.product.create({
                data: {
                    name: validated.name,
                    slug: validated.slug,
                    description: validated.description,
                    featured: validated.featured,
                    isActive: validated.isActive,
                    categoryId: validated.categoryId,
                    variants: {
                        create: validated.variants.map(v => ({
                            name: v.name,
                            price: v.price,
                            originalPrice: v.originalPrice,
                            stock: v.stock,
                            sku: v.sku
                        }))
                    },
                    images: {
                        create: (validated.images || []).map(url => ({
                            imageUrl: url
                        }))
                    }
                },
                include: {
                    category: true,
                    variants: true,
                    images: true
                }
            })
            return newProduct
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        console.error("Products POST error:", error)
        return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 400 })
    }
}
