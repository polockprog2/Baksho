import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { withAuth } from "@/lib/withAuth"
import { handleApiError } from "@/lib/errorHandler"

// GET /api/cart — Get current user's cart
export const GET = withAuth(async function GET(req) {
    try {
        const session = req.session
        let cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: { take: 1 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.user.id },
                include: { items: [] }
            })
        }

        // Format items for the frontend
        const formattedItems = (cart.items || []).map(item => ({
            id: item.id,
            variantId: item.variantId,
            productId: item.variant.productId,
            name: item.variant.product.name,
            variantName: item.variant.name,
            price: item.variant.price,
            originalPrice: item.variant.originalPrice,
            stock: item.variant.stock,
            image: item.variant.product.images[0]?.imageUrl || null,
            quantity: item.quantity
        }))

        return NextResponse.json({ items: formattedItems })
    } catch (error) {
        return handleApiError(error, "Cart GET")
    }
})

// POST /api/cart — Add item to cart
export const POST = withAuth(async function POST(req) {
    try {
        const session = req.session
        const { variantId, quantity = 1 } = await req.json()

        if (!variantId) {
            return NextResponse.json({ error: "variantId is required" }, { status: 400 })
        }

        // Ensure cart exists
        let cart = await prisma.cart.findUnique({
            where: { userId: session.user.id }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.user.id }
            })
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, variantId }
        })

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            })
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, variantId, quantity }
            })
        }

        return NextResponse.json({ message: "Item added to cart" }, { status: 201 })
    } catch (error) {
        return handleApiError(error, "Cart POST")
    }
})

// PATCH /api/cart — Update item quantity
export const PATCH = withAuth(async function PATCH(req) {
    try {
        const session = req.session
        const { itemId, quantity } = await req.json()

        if (!itemId || quantity === undefined) {
            return NextResponse.json({ error: "itemId and quantity are required" }, { status: 400 })
        }

        if (quantity <= 0) {
            await prisma.cartItem.delete({ where: { id: itemId } })
            return NextResponse.json({ message: "Item removed from cart" })
        }

        await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        })

        return NextResponse.json({ message: "Cart updated" })
    } catch (error) {
        return handleApiError(error, "Cart PATCH")
    }
})

// DELETE /api/cart — Clear all items or remove specific item
export const DELETE = withAuth(async function DELETE(req) {
    try {
        const session = req.session
        const { searchParams } = new URL(req.url)
        const itemId = searchParams.get("itemId")

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id }
        })

        if (!cart) {
            return NextResponse.json({ message: "Cart is already empty" })
        }

        if (itemId) {
            await prisma.cartItem.delete({ where: { id: itemId } })
            return NextResponse.json({ message: "Item removed" })
        }

        // Clear all items
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
        return NextResponse.json({ message: "Cart cleared" })
    } catch (error) {
        return handleApiError(error, "Cart DELETE")
    }
})
