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

        const { id } = await params

        // Users can only see their own addresses, admins can see all
        if (session.user.role !== "ADMIN" && session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const addresses = await prisma.address.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(addresses)
    } catch (error) {
        console.error("Addresses GET error:", error)
        return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
    }
}

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Users can only add addresses to their own profile
        if (session.user.role !== "ADMIN" && session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { type, street, city, state, zipCode, country, isDefault } = body

        if (!street || !city || !state || !zipCode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: id, isDefault: true },
                data: { isDefault: false }
            })
        }

        const address = await prisma.address.create({
            data: {
                userId: id,
                type: type || "HOME",
                street,
                city,
                state,
                zipCode,
                country: country || "USA",
                isDefault: isDefault || false
            }
        })

        return NextResponse.json(address, { status: 201 })
    } catch (error) {
        console.error("Address POST error:", error)
        return NextResponse.json({ error: "Failed to create address" }, { status: 400 })
    }
}
