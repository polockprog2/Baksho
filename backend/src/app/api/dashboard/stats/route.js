import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/withAuth';

/**
 * Helper: calculate percentage change between two values
 */
function calcTrend(current, previous) {
    if (previous === 0 && current === 0) return '0%';
    if (previous === 0) return '+100%';
    const pct = ((current - previous) / previous) * 100;
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(1)}%`;
}

export const GET = withAdminAuth(async function GET(req) {
    try {
        // Date ranges for trend calculation
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const sixtyDaysAgo = new Date(now);
        sixtyDaysAgo.setDate(now.getDate() - 60);

        const [
            // Current period (last 30 days)
            currentOrders,
            currentRevenueRes,
            currentCustomers,
            // Previous period (30-60 days ago)
            previousOrders,
            previousRevenueRes,
            previousCustomers,
            // Overall stats
            totalOrders,
            totalRevenueRes,
            totalCustomers,
            lowStockCount,
            previousLowStock,
            // Recent data
            recentOrders,
            topVariantsRes
        ] = await Promise.all([
            // Current period counts
            prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: thirtyDaysAgo } } }),
            prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: thirtyDaysAgo } } }),
            // Previous period counts
            prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
            prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
            prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
            // Overall totals
            prisma.order.count(),
            prisma.order.aggregate({ _sum: { total: true } }),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.productVariant.count({ where: { stock: { lt: 10 } } }),
            prisma.productVariant.count({ where: { stock: { lt: 10, gte: 0 } } }),
            // Recent orders for the dashboard feed
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, email: true, name: true } },
                    items: true
                }
            }),
            // Top products by quantity sold
            prisma.orderItem.groupBy({
                by: ['variantId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            })
        ]);

        const revenue = totalRevenueRes._sum.total || 0;
        const currentRevenue = currentRevenueRes._sum.total || 0;
        const previousRevenue = previousRevenueRes._sum.total || 0;

        // Calculate real trends
        const ordersTrend = calcTrend(currentOrders, previousOrders);
        const revenueTrend = calcTrend(currentRevenue, previousRevenue);
        const customersTrend = calcTrend(currentCustomers, previousCustomers);
        const stockDiff = lowStockCount - previousLowStock;
        const stockTrend = stockDiff >= 0 ? `+${stockDiff}` : `${stockDiff}`;

        // Format top products with additional info including revenue
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
            });

            // Calculate revenue for this specific variant
            const variantRevenueRes = await prisma.orderItem.aggregate({
                _sum: { total: true },
                where: { variantId: item.variantId }
            });

            return {
                id: variant?.productId,
                variantId: item.variantId,
                name: `${variant?.product.name} (${variant?.name})`,
                sales: item._sum.quantity,
                revenue: variantRevenueRes._sum.total || 0,
                image: variant?.product.images[0]?.imageUrl,
                price: variant?.price,
                stock: variant?.stock
            };
        }));

        // Calculate real sales data for the last 7 days with correct sorting
        const salesData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            const dayRevenue = await prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDay
                    }
                }
            });

            salesData.push({
                name: days[date.getDay()],
                sales: Number(dayRevenue._sum.total || 0)
            });
        }

        // Format recent orders for the dashboard
        const formattedRecentOrders = recentOrders.map(order => {
            const timeDiff = now - new Date(order.createdAt);
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            let date;
            if (hours < 1) date = 'Just now';
            else if (hours < 24) date = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            else if (hours < 48) date = 'Yesterday';
            else date = `${Math.floor(hours / 24)} days ago`;

            return {
                id: order.id,
                total: order.total,
                status: order.status,
                itemsCount: order.items?.length || 0,
                date,
                customer: order.user?.name || order.user?.email || 'Guest'
            };
        });

        return NextResponse.json({
            kpis: [
                { id: 'total-orders', label: 'Total Orders', value: totalOrders, trend: ordersTrend, icon: 'shopping-bag' },
                { id: 'revenue', label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, trend: revenueTrend, icon: 'euro' },
                { id: 'active-customers', label: 'Active Customers', value: totalCustomers, trend: customersTrend, icon: 'users' },
                { id: 'low-stock', label: 'Low Stock Items', value: lowStockCount, trend: stockTrend, icon: 'alert-triangle' }
            ],
            salesData: salesData,
            recentOrders: formattedRecentOrders,
            topProducts: topProducts
        });
    } catch (error) {
        console.error('API Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
});