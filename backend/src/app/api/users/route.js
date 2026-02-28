import prisma from "@/lib/prisma"
import { updateUserSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search")

        const skip = (page - 1) * limit

        let where = {}
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ])

        return NextResponse.json({
            data: users.map(u => ({
                ...u,
                isAdmin: u.role === "ADMIN"
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Users GET error:", error)
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
}

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validated = updateUserSchema.parse(body)

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: validated,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                role: true
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("User PATCH error:", error)
        return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 400 })
    }
}
