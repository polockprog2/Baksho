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

        // Users can only see their own profile, admins can see all
        if (session.user.role !== "ADMIN" && session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: { addresses: true },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                addresses: true,
                createdAt: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            ...user,
            isAdmin: user.role === "ADMIN"
        })
    } catch (error) {
        console.error("User GET error:", error)
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Users can only update their own profile, admins can update all
        if (session.user.role !== "ADMIN" && session.user.id !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { name, phone, role } = body

        // Only admins can change roles
        const updateData = {
            ...(name && { name }),
            ...(phone && { phone }),
            ...(role && session.user.role === "ADMIN" && { role })
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            include: { addresses: true },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                addresses: true,
                createdAt: true
            }
        })

        return NextResponse.json({
            ...user,
            isAdmin: user.role === "ADMIN"
        })
    } catch (error) {
        console.error("User PATCH error:", error)
        return NextResponse.json({ error: "Failed to update user" }, { status: 400 })
    }
}
