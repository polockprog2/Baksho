import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const [
            totalOrders,
            revenueRes,
            lowStockCount,
            totalCustomers,
            recentOrders,
            topVariantsRes
        ] = await Promise.all([
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { total: true },
            }),
            prisma.productVariant.count({
                where: { stock: { lt: 10 } },
            }),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, email: true, name: true } }
                }
            }),
            prisma.orderItem.groupBy({
                by: ['variantId'],
                _sum: { quantity: true },
                orderBy: {
                    _sum: { quantity: 'desc' }
                },
                take: 5
            })
        ]);

        const revenue = revenueRes._sum.total || 0;

        // Format top products with additional info
        const topProducts = await Promise.all(topVariantsRes.map(async (item) => {
            const variant = await prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: {
                    product: {
                        include: {
                            images: { take: 1 }
                        }
                    }
                }
            })
            return {
                id: variant?.productId,
                variantId: item.variantId,
                name: `${variant?.product.name} (${variant?.name})`,
                sales: item._sum.quantity,
                image: variant?.product.images[0]?.imageUrl,
                price: variant?.price
            }
        }))
        // Calculate real sales data for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesRes = await prisma.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
            select: {
                total: true,
                createdAt: true
            }
        });

        // Group by day
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const salesDataMap = {};

        // Initialize last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];
            salesDataMap[dayName] = 0;
        }

        salesRes.forEach(order => {
            const dayName = days[new Date(order.createdAt).getDay()];
            if (salesDataMap[dayName] !== undefined) {
                salesDataMap[dayName] += Number(order.total);
            }
        });

        const salesData = Object.entries(salesDataMap)
            .map(([name, sales]) => ({ name, sales }))
            .reverse();

        return NextResponse.json({
            kpis: [
                { id: 'total-orders', label: 'Total Orders', value: totalOrders, trend: '+12%', icon: 'shopping-bag' },
                { id: 'revenue', label: 'Total Revenue', value: `€${revenue.toFixed(2)}`, trend: '+8.4%', icon: 'euro' },
                { id: 'active-customers', label: 'Active Customers', value: totalCustomers, trend: '+5.2%', icon: 'users' },
                { id: 'low-stock', label: 'Low Stock Items', value: lowStockCount, trend: '-2', icon: 'alert-triangle' }
            ],
            salesData: salesData,
            recentOrders: recentOrders,
            topProducts: topProducts
        });
    } catch (error) {
        console.error('API Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
