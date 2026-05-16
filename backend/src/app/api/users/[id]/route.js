import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/withAuth"

export const PATCH = withAdminAuth(async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { role } = body;

        if (!role) {
            return NextResponse.json({ error: "Role is required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role: role.toUpperCase() },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("User PATCH error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 400 });
    }
});
