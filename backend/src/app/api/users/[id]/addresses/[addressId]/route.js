import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, addressId } = await params

        // Users can only see their own addresses
        if (session.user.role !== "ADMIN" && session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const address = await prisma.address.findUnique({
            where: { id: addressId }
        })

        if (!address || address.userId !== id) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 })
        }

        return NextResponse.json(address)
    } catch (error) {
        console.error("Address GET error:", error)
        return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 })
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, addressId } = await params

        // Users can only update their own addresses
        if (session.user.role !== "ADMIN" && session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { type, street, city, state, zipCode, country, isDefault } = body

        // Verify address belongs to user
        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId }
        })

        if (!existingAddress || existingAddress.userId !== id) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 })
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: id, isDefault: true, id: { not: addressId } },
                data: { isDefault: false }
            })
        }

        const address = await prisma.address.update({
            where: { id: addressId },
            data: {
                ...(type && { type }),
                ...(street && { street }),
                ...(city && { city }),
                ...(state && { state }),
                ...(zipCode && { zipCode }),
                ...(country && { country }),
                ...(isDefault !== undefined && { isDefault })
            }
        })

        return NextResponse.json(address)
    } catch (error) {
        console.error("Address PATCH error:", error)
        return NextResponse.json({ error: "Failed to update address" }, { status: 400 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, addressId } = await params

        // Users can only delete their own addresses
        if (session.user.role !== "ADMIN" && session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Verify address belongs to user
        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId }
        })

        if (!existingAddress || existingAddress.userId !== id) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 })
        }

        await prisma.address.delete({
            where: { id: addressId }
        })

        return NextResponse.json({ message: "Address deleted successfully" })
    } catch (error) {
        console.error("Address DELETE error:", error)
        return NextResponse.json({ error: "Failed to delete address" }, { status: 400 })
    }
}
