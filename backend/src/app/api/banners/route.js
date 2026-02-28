import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(banners)
    } catch (error) {
        console.error("Banners GET error:", error)
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { title, subtitle, imageUrl, link, type, active } = body

        if (!title || !imageUrl) {
            return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 })
        }

        const banner = await prisma.banner.create({
            data: {
                title,
                subtitle,
                imageUrl,
                link,
                type: type || 'ad',
                active: active !== undefined ? active : true
            }
        })

        return NextResponse.json(banner, { status: 201 })
    } catch (error) {
        console.error("Banners POST error:", error)
        return NextResponse.json({ error: error.message || "Failed to create banner" }, { status: 400 })
    }
}
