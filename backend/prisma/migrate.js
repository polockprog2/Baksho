const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    console.log('Starting data migration...');
    const backupPath = path.join(__dirname, 'backup.json');
    if (!fs.existsSync(backupPath)) {
        console.error('Backup file not found!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    try {
        // 1. Migrate Categories
        console.log('Migrating categories...');
        for (const cat of data.categories) {
            await prisma.category.create({
                data: {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    icon: cat.icon,
                    image: cat.image,
                    description: cat.description,
                    badge: cat.badge,
                    createdAt: new Date(cat.createdAt),
                    updatedAt: new Date(cat.updatedAt)
                }
            });
        }

        // 2. Migrate Users
        console.log('Migrating users...');
        for (const user of data.users) {
            await prisma.user.create({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                    image: user.image,
                    password: user.password,
                    role: user.role,
                    phone: user.phone,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt)
                }
            });
        }

        // 3. Migrate Addresses
        console.log('Migrating addresses...');
        for (const addr of data.addresses) {
            await prisma.address.create({
                data: {
                    id: addr.id,
                    userId: addr.userId,
                    type: addr.type === 'HOME' ? 'HOME' : 'OFFICE', // Basic mapping
                    street: addr.street,
                    city: addr.city,
                    state: addr.state,
                    zipCode: addr.zipCode,
                    country: addr.country,
                    isDefault: addr.isDefault,
                    createdAt: new Date(addr.createdAt),
                    updatedAt: new Date(addr.updatedAt)
                }
            });
        }

        // 4. Migrate Products and create Variants
        console.log('Migrating products and variants...');
        for (const prod of data.products) {
            const product = await prisma.product.create({
                data: {
                    id: prod.id,
                    name: prod.name,
                    slug: prod.slug,
                    description: prod.description,
                    isActive: prod.isActive !== undefined ? prod.isActive : prod.inStock,
                    featured: prod.featured || false,
                    categoryId: prod.categoryId,
                    createdAt: new Date(prod.createdAt),
                    updatedAt: new Date(prod.updatedAt)
                }
            });

            // Create Default Variant
            const variant = await prisma.productVariant.create({
                data: {
                    productId: product.id,
                    name: prod.unit || 'Default',
                    price: prod.price,
                    originalPrice: prod.originalPrice,
                    stock: prod.stock || 0,
                    sku: `SKU-${prod.slug.toUpperCase()}`
                }
            });

            // Create Product Image record if image exists
            if (prod.image) {
                await prisma.productImage.create({
                    data: {
                        productId: product.id,
                        imageUrl: prod.image
                    }
                });
            }
        }

        // 5. Migrate Banners
        console.log('Migrating banners...');
        for (const banner of data.banners) {
            await prisma.banner.create({
                data: {
                    id: banner.id,
                    title: banner.title,
                    imageUrl: banner.imageUrl,
                    link: banner.link,
                    active: banner.active,
                    createdAt: new Date(banner.createdAt),
                    updatedAt: new Date(banner.updatedAt)
                }
            });
        }

        // 6. Migrate Orders (Snapshotting address)
        console.log('Migrating orders...');
        for (const ord of data.orders) {
            const order = await prisma.order.create({
                data: {
                    id: ord.id,
                    userId: ord.userId,
                    status: ord.status,
                    paymentStatus: 'PAID', // Defaulting for simple migration
                    subtotal: ord.subtotal,
                    tax: ord.tax,
                    deliveryFee: ord.deliveryFee,
                    total: ord.total,
                    paymentMethod: ord.paymentMethod,
                    createdAt: new Date(ord.createdAt),
                    updatedAt: new Date(ord.updatedAt)
                }
            });

            // Create OrderAddress snapshot from the original order's deliveryAddressId if possible
            const originalAddr = data.addresses.find(a => a.id === ord.deliveryAddressId);
            if (originalAddr) {
                await prisma.orderAddress.create({
                    data: {
                        orderId: order.id,
                        street: originalAddr.street,
                        city: originalAddr.city,
                        state: originalAddr.state,
                        zipCode: originalAddr.zipCode,
                        country: originalAddr.country
                    }
                });
            }

            // Migrate OrderItems (linking to the newly created variant)
            for (const item of ord.items) {
                const variant = await prisma.productVariant.findFirst({
                    where: { productId: item.productId }
                });

                if (variant) {
                    await prisma.orderItem.create({
                        data: {
                            orderId: order.id,
                            variantId: variant.id,
                            price: item.price,
                            quantity: item.quantity
                        }
                    });
                }
            }
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
