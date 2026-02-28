import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET: Fetch all homepage related settings
 */
export async function GET() {
    try {
        const settings = await prisma.setting.findMany({
            where: { group: 'homepage' }
        });

        // Convert array to object for easier consumption on frontend
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settingsMap);
    } catch (error) {
        console.error('API Settings GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * PUT: Update multiple homepage settings
 * Admin only
 */
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json(); // { key: value, ... }

        const updates = Object.entries(data).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value },
                create: {
                    key,
                    value: String(value),
                    group: 'homepage'
                }
            });
        });

        await Promise.all(updates);

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('API Settings PUT Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
