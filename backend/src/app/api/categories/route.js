import prisma from "@/lib/prisma"
import { categorySchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import logger from "@/lib/logger"

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        const transformedCategories = categories.map(cat => ({
            id: cat.id,
            slug: cat.slug,
            name: cat.name,
            icon: cat.icon || '📦',
            image: cat.image,
            description: cat.description,
            parentId: cat.parentId,
            productCount: cat._count.products,
            badge: cat.badge
        }))

        return NextResponse.json(transformedCategories)
    } catch (error) {
        logger.error("Categories GET error", { message: error.message })
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validated = categorySchema.parse(body)

        const category = await prisma.category.create({
            data: validated
        })

        return NextResponse.json(category, { status: 201 })
    } catch (error) {
        logger.error("Categories POST error", { message: error.message })
        return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 400 })
    }
}
