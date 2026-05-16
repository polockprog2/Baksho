import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { handleApiError } from "@/lib/errorHandler"

// GET /api/banners - List all banners
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get("active") === "true";

        const where = activeOnly ? { active: true } : {};
        
        const banners = await prisma.banner.findMany({
            where,
            orderBy: { position: 'asc' }
        });

        return NextResponse.json({ data: banners });
    } catch (error) {
        return handleApiError(error, "Banners GET");
    }
}

// POST /api/banners - Create a new banner (admin)
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, subtitle, imageUrl, link, type, position } = body;

        if (!title || !imageUrl) {
            return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
        }

        const banner = await prisma.banner.create({
            data: {
                title,
                subtitle,
                imageUrl,
                link,
                type: type || 'promotion',
                position: position || 0,
                active: true
            }
        });

        return NextResponse.json(banner, { status: 201 });
    } catch (error) {
        return handleApiError(error, "Banners POST");
    }
}

// PATCH /api/banners/[id] is handled in a separate route or here if we use query params, 
// but [id] is better. I'll use a separate file for [id].
