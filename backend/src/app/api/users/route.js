import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/withAuth"

// GET /api/users - List all users
export const GET = withAdminAuth(async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const role = searchParams.get("role");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        let where = {};
        if (role) {
            where.role = role.toUpperCase();
        }
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    image: true,
                    createdAt: true,
                    _count: {
                        select: { orders: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);

        return NextResponse.json({
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Users GET error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
});

// PATCH /api/users/[id] - Handled in a separate file if needed, but for simplicity we can use a root PATCH or separate file
