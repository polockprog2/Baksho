import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { handleApiError } from "@/lib/errorHandler"

// PATCH /api/coupons/[id] — Update a coupon (admin only)
export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        
        const updateData = { ...body }
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase()
        }
        if (updateData.expiresAt) {
            updateData.expiresAt = new Date(updateData.expiresAt)
        }

        const coupon = await prisma.coupon.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(coupon)
    } catch (error) {
        return handleApiError(error, "Coupons PATCH")
    }
}

// DELETE /api/coupons/[id] — Delete a coupon (admin only)
export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        await prisma.coupon.delete({ where: { id } })

        return NextResponse.json({ message: "Coupon deleted" })
    } catch (error) {
        return handleApiError(error, "Coupons DELETE")
    }
}
