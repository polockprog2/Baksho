import prisma from "@/lib/prisma"
import { updateProductSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req, { params }) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: true,
                images: true
            }
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error("Product GET error:", error)
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
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
        const validated = updateProductSchema.parse(body)

        const product = await prisma.product.update({
            where: { id },
            data: validated,
            include: { category: true }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("Product PATCH error:", error)
        return NextResponse.json({ error: "Failed to update product" }, { status: 400 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Product deleted successfully" })
    } catch (error) {
        console.error("Product DELETE error:", error)
        return NextResponse.json({ error: "Failed to delete product" }, { status: 400 })
    }
}
