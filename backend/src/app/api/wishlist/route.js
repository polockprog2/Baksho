import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { handleApiError } from "@/lib/errorHandler"

// GET /api/wishlist — Get current user's wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        // Only include product-level data; client can fetch full product as needed
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!wishlist) {
            // Verify user still exists (handles stale sessions after re-seed)
            const userExists = await prisma.user.findUnique({ where: { id: session.user.id } })
            if (!userExists) {
                return NextResponse.json({ error: "User not found. Please log in again." }, { status: 401 })
            }
            wishlist = await prisma.wishlist.create({
                data: { userId: session.user.id },
                include: { items: true }
            })
        }

        return NextResponse.json({ items: wishlist.items })
    } catch (error) {
        return handleApiError(error, "Wishlist GET")
    }
}

// POST /api/wishlist — Add a product to the wishlist
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { productId } = await req.json()

        if (!productId) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 })
        }

        // Ensure wishlist exists
        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.user.id }
        })

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId: session.user.id }
            })
        }

        // Add item (upsert to handle duplicates gracefully)
        const item = await prisma.wishlistItem.upsert({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId
                }
            },
            update: {},
            create: {
                wishlistId: wishlist.id,
                productId
            }
        })

        return NextResponse.json(item, { status: 201 })
    } catch (error) {
        return handleApiError(error, "Wishlist POST")
    }
}

// DELETE /api/wishlist?productId=xxx — Remove a product from the wishlist
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const productId = searchParams.get("productId")

        if (!productId) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 })
        }

        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.user.id }
        })

        if (!wishlist) {
            return NextResponse.json({ message: "Wishlist not found" }, { status: 404 })
        }

        await prisma.wishlistItem.deleteMany({
            where: {
                wishlistId: wishlist.id,
                productId
            }
        })

        return NextResponse.json({ message: "Item removed from wishlist" })
    } catch (error) {
        return handleApiError(error, "Wishlist DELETE")
    }
}
