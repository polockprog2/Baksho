import prisma from "@/lib/prisma"
import { orderSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import logger from "@/lib/logger"
import { handleApiError } from "@/lib/errorHandler"

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            throw new Error("Unauthorized");
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const status = searchParams.get("status")
        const userId = searchParams.get("userId")
        const search = searchParams.get("search")

        const skip = (page - 1) * limit

        let where = {}

        // If user is not admin, only show their own orders
        if (session.user.role !== "ADMIN") {
            where.userId = session.user.id
        } else if (userId) {
            where.userId = userId
        }

        if (status) {
            where.status = status.toUpperCase()
        }

        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } }
            ]
        }

        logger.info(`Fetching orders [page=${page}, status=${status}, user=${session.user.id}]`);

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: {
                                        include: {
                                            images: { take: 1 }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    address: true,
                    user: { select: { id: true, email: true, name: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count({ where })
        ])

        return NextResponse.json({
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return handleApiError(error, "Orders GET");
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            throw new Error("Unauthorized");
        }

        const body = await req.json()
        const validated = orderSchema.parse(body)

        logger.info(`Creating new order for user: ${session.user.id}`);

        // Transaction to create order and update inventory
        const order = await prisma.$transaction(async (tx) => {
            // 1. Get original address for snapshot
            const originalAddr = await tx.address.findUnique({
                where: { id: validated.deliveryAddressId }
            });
            if (!originalAddr) throw new Error("Delivery address not found");

            // 2. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    subtotal: validated.subtotal,
                    tax: validated.tax,
                    deliveryFee: validated.deliveryFee,
                    total: validated.total,
                    paymentMethod: validated.paymentMethod,
                    status: 'PENDING',
                    address: {
                        create: {
                            street: originalAddr.street,
                            city: originalAddr.city,
                            state: originalAddr.state,
                            zipCode: originalAddr.zipCode,
                            country: originalAddr.country
                        }
                    },
                    items: {
                        create: validated.items.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    items: true,
                    address: true,
                    user: { select: { id: true, email: true, name: true } }
                }
            })

            // 3. Update stocks and log inventory
            for (const item of validated.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });

                await tx.inventoryLog.create({
                    data: {
                        variantId: item.variantId,
                        change: -item.quantity,
                        reason: `Order #${newOrder.id}`
                    }
                });
            }

            return newOrder
        })

        return NextResponse.json(order, { status: 201 })
    } catch (error) {
        return handleApiError(error, "Orders POST");
    }
}

