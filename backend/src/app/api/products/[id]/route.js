import prisma from "@/lib/prisma"
import { updateProductSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import logger from "@/lib/logger"

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
        logger.error("Product GET error", { message: error.message })
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
        const { variants, images, ...productData } = body

        // Handle nested updates
        const updateData = { ...productData }

        if (variants && variants.length > 0) {
            // Simple approach for the admin dashboard: update existing variants or replace
            // For now, let's just update the first variant or recreate them
            // A more robust way is to use upsert, but let's clear and recreate for simplicity in this MVP
            updateData.variants = {
                deleteMany: {},
                create: variants.map(v => ({
                    name: v.name,
                    price: v.price,
                    originalPrice: v.originalPrice,
                    stock: v.stock,
                    sku: v.sku
                }))
            }
        }

        if (images) {
            updateData.images = {
                deleteMany: {},
                create: images.map(url => ({
                    imageUrl: url
                }))
            }
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { 
                category: true,
                variants: true,
                images: true
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        logger.error("Product PATCH error", { message: error.message })
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
        
        await prisma.$transaction(async (tx) => {
            // Delete dependent records that don't have cascade delete
            await tx.review.deleteMany({ where: { productId: id } })
            
            // Delete references in Cart and Orders (via variants)
            await tx.cartItem.deleteMany({ where: { variant: { productId: id } } })
            await tx.orderItem.deleteMany({ where: { variant: { productId: id } } })
            
            // Delete the product (variants and images will cascade)
            await tx.product.delete({
                where: { id }
            })
        })

        return NextResponse.json({ message: "Product deleted successfully" })
    } catch (error) {
        logger.error("Product DELETE error", { message: error.message })
        return NextResponse.json({ error: "Failed to delete product" }, { status: 400 })
    }
}
