import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { handleApiError } from "@/lib/errorHandler"

// GET /api/coupons — List all coupons (admin) or validate a code (public)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get("code")

        // Public: Validate a coupon code
        if (code) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: code.toUpperCase() }
            })

            if (!coupon) {
                return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
            }

            if (!coupon.isActive) {
                return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 })
            }

            if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
                return NextResponse.json({ error: "This coupon has expired" }, { status: 400 })
            }

            if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 })
            }

            return NextResponse.json({
                id: coupon.id,
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minOrder: coupon.minOrder,
                maxDiscount: coupon.maxDiscount
            })
        }

        // Admin: List all coupons
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ data: coupons })
    } catch (error) {
        return handleApiError(error, "Coupons GET")
    }
}

// POST /api/coupons — Create a new coupon (admin only)
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { code, type, value, minOrder, maxDiscount, maxUses, expiresAt } = body

        if (!code || !value) {
            return NextResponse.json({ error: "Code and value are required" }, { status: 400 })
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                type: type || 'PERCENTAGE',
                value,
                minOrder: minOrder || null,
                maxDiscount: maxDiscount || null,
                maxUses: maxUses || null,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        })

        return NextResponse.json(coupon, { status: 201 })
    } catch (error) {
        return handleApiError(error, "Coupons POST")
    }
}
