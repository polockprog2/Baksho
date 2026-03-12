import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import logger from "@/lib/logger"
import { handleApiError } from "@/lib/errorHandler"

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
            where.variants = {
                some: {
                    originalPrice: { gt: 0 }
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
        const sortByPrice = sort === "price-low" || sort === "price-high";
        if (sort === "name-az") {
            orderBy = { name: 'asc' }
        } else if (!sortByPrice) {
            orderBy = { createdAt: 'desc' }
        }

        logger.info(`Fetching products [page=${page}, limit=${limit}, category=${category}]`);

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    variants: true,
                    images: true
                },
                orderBy: sortByPrice ? { createdAt: 'desc' } : orderBy,
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ])

        // Post-process: sort by first variant price if requested
        let sortedProducts = products;
        if (sortByPrice) {
            sortedProducts = [...products].sort((a, b) => {
                const priceA = a.variants?.[0]?.price || 0;
                const priceB = b.variants?.[0]?.price || 0;
                return sort === "price-low" ? priceA - priceB : priceB - priceA;
            });
        }

        return NextResponse.json({
            data: sortedProducts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return handleApiError(error, "Products GET");
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        const body = await req.json()
        const validated = productSchema.parse(body)

        logger.info(`Creating new product: ${validated.name}`);

        const product = await prisma.$transaction(async (tx) => {
            return await tx.product.create({
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
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        return handleApiError(error, "Products POST");
    }
}

