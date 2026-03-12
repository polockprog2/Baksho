import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { handleApiError } from "@/lib/errorHandler"

// GET /api/reviews?productId=xxx — Get reviews for a product
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const productId = searchParams.get("productId")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")

        if (!productId) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 })
        }

        const skip = (page - 1) * limit

        const [reviews, total, avgRating] = await Promise.all([
            prisma.review.findMany({
                where: { productId },
                include: {
                    user: { select: { id: true, name: true, image: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.review.count({ where: { productId } }),
            prisma.review.aggregate({
                where: { productId },
                _avg: { rating: true }
            })
        ])

        return NextResponse.json({
            data: reviews,
            averageRating: avgRating._avg.rating || 0,
            totalReviews: total,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return handleApiError(error, "Reviews GET")
    }
}

// POST /api/reviews — Create a review
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "You must be logged in to leave a review" }, { status: 401 })
        }

        const { productId, rating, comment } = await req.json()

        if (!productId || !rating) {
            return NextResponse.json({ error: "productId and rating are required" }, { status: 400 })
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: session.user.id,
                productId
            }
        })

        if (existingReview) {
            // Update existing review
            const updated = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment },
                include: { user: { select: { id: true, name: true, image: true } } }
            })
            return NextResponse.json(updated)
        }

        // Create new review
        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating,
                comment: comment || null
            },
            include: {
                user: { select: { id: true, name: true, image: true } }
            }
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        return handleApiError(error, "Reviews POST")
    }
}

// DELETE /api/reviews — Delete a review (admin or review owner)
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const reviewId = searchParams.get("id")

        if (!reviewId) {
            return NextResponse.json({ error: "Review ID is required" }, { status: 400 })
        }

        const review = await prisma.review.findUnique({ where: { id: reviewId } })

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 })
        }

        // Only allow owner or admin to delete
        if (review.userId !== session.user.id && session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        await prisma.review.delete({ where: { id: reviewId } })

        return NextResponse.json({ message: "Review deleted" })
    } catch (error) {
        return handleApiError(error, "Reviews DELETE")
    }
}
