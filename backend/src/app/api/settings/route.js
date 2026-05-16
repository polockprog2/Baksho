import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/withAuth"

// GET /api/settings - Fetch all settings
export const GET = withAdminAuth(async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        
        // Transform array of {key, value} to a single object
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settingsObj);
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
});

// PATCH /api/settings - Update multiple settings
export const PATCH = withAdminAuth(async function PATCH(req) {
    try {
        const body = await req.json();
        
        // Upsert each setting
        const updates = Object.entries(body).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });

        await prisma.$transaction(updates);

        return NextResponse.json({ message: "Settings updated successfully" });
    } catch (error) {
        console.error("Settings PATCH error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 400 });
    }
});
