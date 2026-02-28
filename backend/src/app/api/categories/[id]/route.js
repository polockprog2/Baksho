import prisma from "@/lib/prisma"
import { updateCategorySchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req, { params }) {
    try {
        const { id } = await params
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true }
                }
            }
        })

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 })
        }

        return NextResponse.json({
            ...category,
            productCount: category._count.products
        })
    } catch (error) {
        console.error("Category GET error:", error)
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const validated = updateCategorySchema.parse(body)

        const category = await prisma.category.update({
            where: { id },
            data: validated
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("Category PATCH error:", error)
        return NextResponse.json({ error: "Failed to update category" }, { status: 400 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Check if there are products in this category
        const productsCount = await prisma.product.count({
            where: { categoryId: id }
        })

        if (productsCount > 0) {
            return NextResponse.json({
                error: "Cannot delete category with associated products. Please move or delete products first."
            }, { status: 400 })
        }

        await prisma.category.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Category deleted successfully" })
    } catch (error) {
        console.error("Category DELETE error:", error)
        return NextResponse.json({ error: "Failed to delete category" }, { status: 400 })
    }
}
