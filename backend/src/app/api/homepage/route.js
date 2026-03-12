import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/errorHandler"
import logger from "@/lib/logger"

/**
 * GET /api/homepage — Bundled homepage data
 * Returns featured products, new arrivals, deals, and categories in a single request
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const featuredLimit = parseInt(searchParams.get("featuredLimit") || "8")
        const newArrivalsLimit = parseInt(searchParams.get("newArrivalsLimit") || "8")
        const dealsLimit = parseInt(searchParams.get("dealsLimit") || "20")

        logger.info("Fetching bundled homepage data")

        const [featuredProducts, newArrivals, deals, categories] = await Promise.all([
            // Featured products
            prisma.product.findMany({
                where: { featured: true, isActive: true },
                include: {
                    category: true,
                    variants: true,
                    images: true
                },
                orderBy: { createdAt: 'desc' },
                take: featuredLimit
            }),
            // New arrivals (latest)
            prisma.product.findMany({
                where: { isActive: true },
                include: {
                    category: true,
                    variants: true,
                    images: true
                },
                orderBy: { createdAt: 'desc' },
                take: newArrivalsLimit
            }),
            // Deals (products with originalPrice set)
            prisma.product.findMany({
                where: {
                    isActive: true,
                    variants: {
                        some: {
                            originalPrice: { gt: 0 }
                        }
                    }
                },
                include: {
                    category: true,
                    variants: true,
                    images: true
                },
                orderBy: { createdAt: 'desc' },
                take: dealsLimit
            }),
            // Categories
            prisma.category.findMany({
                orderBy: { name: 'asc' }
            })
        ])

        return NextResponse.json({
            featuredProducts,
            newArrivals,
            deals,
            categories
        })
    } catch (error) {
        return handleApiError(error, "Homepage GET")
    }
}
