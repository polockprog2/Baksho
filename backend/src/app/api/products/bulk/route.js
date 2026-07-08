import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { productSchema } from "@/lib/validations"

function parseCsvLine(line) {
    const values = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
        } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
        } else {
            current += char
        }
    }

    values.push(current.trim())
    return values
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file")

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        const text = await file.text()
        const lines = text.split(/\r?\n/)
        const header = parseCsvLine(lines[0])

        // Expected header: name,slug,description,categorySlug,variantName,price,originalPrice,stock,sku,imageUrls
        const results = {
            success: 0,
            failed: 0,
            errors: []
        }

        // Fetch all categories once to avoid multiple DB calls
        const allCategories = await prisma.category.findMany()
        const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]))

        const productsToCreate = []

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue

            const values = parseCsvLine(line)
            if (values.length < 10) {
                results.failed++
                results.errors.push(`Line ${i + 1}: Insufficient columns`)
                continue
            }

            const [name, slug, description, categorySlug, variantName, price, originalPrice, stock, sku, imageUrls] = values
            const normalizedCategorySlug = categorySlug.trim().toLowerCase()

            const categoryId = categoryMap.get(normalizedCategorySlug)
            if (!categoryId) {
                results.failed++
                results.errors.push(`Line ${i + 1}: Category slug '${categorySlug}' not found`)
                continue
            }

            const productData = {
                name,
                slug,
                description,
                categoryId,
                featured: false,
                isActive: true,
                variants: [
                    {
                        name: variantName || "Standard",
                        price: parseFloat(price) || 0,
                        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                        stock: parseInt(stock) || 0,
                        sku: sku || null
                    }
                ],
                images: imageUrls ? imageUrls.split(";").map(url => url.trim()) : []
            }

            try {
                // Validate using existing schema
                productSchema.parse(productData)
                productsToCreate.push(productData)
            } catch (err) {
                results.failed++
                results.errors.push(`Line ${i + 1}: Validation error - ${err.message}`)
            }
        }

        // Batch creation with transactions
        for (const product of productsToCreate) {
            try {
                await prisma.$transaction(async (tx) => {
                    await tx.product.create({
                        data: {
                            name: product.name,
                            slug: product.slug,
                            description: product.description,
                            featured: product.featured,
                            isActive: product.isActive,
                            categoryId: product.categoryId,
                            variants: {
                                create: product.variants
                            },
                            images: {
                                create: product.images.map(url => ({ imageUrl: url }))
                            }
                        }
                    })
                })
                results.success++
            } catch (err) {
                results.failed++
                results.errors.push(`Failed to create product '${product.name}': ${err.message}`)
            }
        }

        return NextResponse.json(results)
    } catch (error) {
        console.error("Bulk upload error:", error)
        return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 })
    }
}
