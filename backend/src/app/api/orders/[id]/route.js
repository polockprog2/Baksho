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
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                address: true,
                user: { select: { id: true, email: true, name: true } }
            }
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        // Check authorization: user can only see their own orders, admins can see all
        if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Order GET error:", error)
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
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
        const { status } = body

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 })
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status: status.toUpperCase() },
            include: {
                items: true,
                address: true,
                user: { select: { id: true, email: true, name: true } }
            }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error("Order PATCH error:", error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 400 })
    }
}
