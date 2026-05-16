import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/withAuth"

// POST /api/products/inventory
// Actions: adjust, restock-low
export const POST = withAdminAuth(async function POST(req) {
    try {
        const { action, productIds, amount } = await req.json();

        if (action === 'adjust') {
            if (!productIds || !productIds.length || amount === undefined) {
                return NextResponse.json({ error: "Missing required fields for adjust" }, { status: 400 });
            }

            const updates = productIds.map(id => {
                return prisma.productVariant.update({
                    where: { id },
                    data: {
                        stock: {
                            increment: amount
                        }
                    }
                });
            });

            await prisma.$transaction(updates);
            return NextResponse.json({ message: "Stock adjusted successfully" });
        }

        if (action === 'restock-low') {
            // Find all variants with stock < 10
            const lowStockVariants = await prisma.productVariant.findMany({
                where: { stock: { lt: 10 } }
            });

            if (lowStockVariants.length === 0) {
                return NextResponse.json({ message: "No low stock items found" });
            }

            const updates = lowStockVariants.map(v => {
                return prisma.productVariant.update({
                    where: { id: v.id },
                    data: {
                        stock: {
                            increment: 50 // Default restock amount
                        }
                    }
                });
            });

            await prisma.$transaction(updates);
            return NextResponse.json({ message: `Restocked ${lowStockVariants.length} items successfully` });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Inventory POST error:", error);
        return NextResponse.json({ error: "Failed to process inventory action" }, { status: 500 });
    }
});
