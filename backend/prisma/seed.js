/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Seed Configuration
const CATEGORIES_DATA = [
    { name: 'Vegetables', slug: 'vegetables', icon: '🥬', description: 'Fresh vegetables delivered daily', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Fruits', slug: 'fruits', icon: '🍎', description: 'Fresh fruits and berries', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=600' },
    { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛', description: 'Fresh dairy and farm eggs', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600' },
    { name: 'Meat & Fish', slug: 'meat-fish', icon: '🥩', description: 'Quality meat and fresh fish', image: 'https://images.unsplash.com/photo-1607623273573-fb94038a8e1b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bakery', slug: 'bakery', icon: '🍞', description: 'Freshly baked bread and pastries', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600' },
    { name: 'Snacks & Drinks', slug: 'snacks-drinks', icon: '🍿', description: 'Popular snacks and refreshments', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Rice & Grains', slug: 'rice-grains', icon: '🍚', description: 'Essential rice and grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Spices & Oil', slug: 'spices-oil', icon: '🌶️', description: 'Authentic spices and cooking oil', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600' },
    { name: 'Baby Care', slug: 'baby-care', icon: '👶', description: 'Products for your little ones', image: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=600' },
    { name: 'Household', slug: 'household', icon: '🧼', description: 'Cleaning and home essentials', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600' },
]

const BANNERS_DATA = [
    {
        title: 'Fresh Summer Deals',
        imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1200',
        link: '/products?category=fruits',
        active: true
    },
    {
        title: 'Organic Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?auto=format&fit=crop&q=80&w=1200',
        link: '/products?category=vegetables',
        active: true
    },
    {
        title: 'Premium Steaks',
        imageUrl: 'https://images.unsplash.com/photo-1544022613-e87a03018ed3?auto=format&fit=crop&q=80&w=1200',
        link: '/products?category=meat-fish',
        active: true
    }
]

const PRODUCT_TEMPLATES = {
    'vegetables': [
        { name: 'Fresh Tomatoes', price: 2.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcccf' },
        { name: 'Red Onions', price: 1.49, unit: 'kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb' },
        { name: 'Green Cucumber', price: 1.25, unit: 'kg', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d02d' },
        { name: 'Organic Spinach', price: 3.50, unit: 'bunch', image: 'https://images.unsplash.com/photo-1524225914-f8595971e41f' },
        { name: 'Bell Peppers', price: 4.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1526346698384-1b6fe57aee97' },
        { name: 'Fresh Potatoes', price: 1.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1508313880080-c4bef0730395' },
        { name: 'Broccoli', price: 2.49, unit: 'pc', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bbe' },
        { name: 'Bio-Carrots', price: 1.89, unit: 'kg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37' },
        { name: 'Garlic', price: 0.99, unit: 'net', image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383' },
    ],
    'fruits': [
        { name: 'Gala Apples', price: 3.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1560806887-1295a3f359cd' },
        { name: 'Yellow Bananas', price: 0.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1571771894821-ad9b5886d39b' },
        { name: 'Sweet Oranges', price: 2.49, unit: 'kg', image: 'https://images.unsplash.com/photo-1582967788606-a171c1070dd9' },
        { name: 'Fresh Grapes', price: 5.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8c' },
        { name: 'Red Strawberries', price: 4.50, unit: 'pack', image: 'https://images.unsplash.com/photo-1464960351845-d3ec27532bc1' },
        { name: 'Conference Pears', price: 3.29, unit: 'kg', image: 'https://images.unsplash.com/photo-1514756331096-242f390efe47' },
        { name: 'Blueberries', price: 3.99, unit: '125g', image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e' },
        { name: 'Avocado', price: 1.49, unit: 'pc', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578' },
    ],
    'dairy-eggs': [
        { name: 'Whole Milk', price: 3.49, unit: '1L', image: 'https://images.unsplash.com/photo-1550583724-125581fe2f8a' },
        { name: 'Farm Eggs', price: 4.99, unit: '12pcs', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03' },
        { name: 'Natural Yogurt', price: 2.75, unit: '500g', image: 'https://images.unsplash.com/photo-1571212405032-4c9968cbac21' },
        { name: 'Butter', price: 3.99, unit: '250g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d' },
        { name: 'Gouda Cheese', price: 4.50, unit: '400g', image: 'https://images.unsplash.com/photo-1523293836413-44a8b2efd673' },
        { name: 'Bio-Oat Milk', price: 2.29, unit: '1L', image: 'https://images.unsplash.com/photo-1550583724-125581fe2f8a' },
    ],
    'meat-fish': [
        { name: 'Chicken Breast', price: 12.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791' },
        { name: 'Salmon Fillet', price: 24.99, unit: 'kg', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288' },
        { name: 'Beef Steak', price: 18.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143' },
        { name: 'German Bratwurst', price: 7.99, unit: '500g', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270' },
        { name: 'Salami Milano', price: 3.50, unit: '100g', image: 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1' },
    ],
    'bakery': [
        { name: 'Fresh Baguette', price: 1.50, unit: 'pc', image: 'https://images.unsplash.com/photo-1597079910443-60c43fc4f729' },
        { name: 'Croissants', price: 4.99, unit: '4pcs', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a' },
        { name: 'Sourdough Bread', price: 4.50, unit: 'pc', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb' },
        { name: 'German Rye Bread', price: 3.99, unit: '500g', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec' },
        { name: 'Traditional Brezel', price: 1.20, unit: 'pc', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06' },
    ],
    'snacks-drinks': [
        { name: 'Potato Chips', price: 2.25, unit: '150g', image: 'https://images.unsplash.com/photo-1566478431375-704231b576f7' },
        { name: 'Sparkling Water', price: 0.99, unit: '1.5L', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504' },
        { name: 'Dark Chocolate', price: 3.50, unit: '100g', image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2' },
        { name: 'Haribo Goldbears', price: 1.49, unit: '200g', image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b' },
        { name: 'Apple Spritzer', price: 1.99, unit: '1L', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd' },
        { name: 'Premium Coffee Beans', price: 15.99, unit: '1kg', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e' },
    ],
    'rice-grains': [
        { name: 'Basmati Rice', price: 14.99, unit: '5kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c' },
        { name: 'Red Lentils', price: 3.50, unit: '1kg', image: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515' },
        { name: 'Chickpeas', price: 2.99, unit: '1kg', image: 'https://images.unsplash.com/photo-1585821033037-1428f5228581' },
        { name: 'Whole Wheat Flour', price: 5.49, unit: '2kg', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff' },
        { name: 'Spaghetti No.5', price: 1.99, unit: '500g', image: 'https://images.unsplash.com/photo-1551462147-37885abb3e4a' },
        { name: 'Bio-Muesli', price: 4.50, unit: '750g', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18acc' },
    ],
    'spices-oil': [
        { name: 'Extra Virgin Olive Oil', price: 12.99, unit: '1L', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5' },
        { name: 'Sunflower Oil', price: 4.50, unit: '2L', image: 'https://images.unsplash.com/photo-1474440693025-a1c6a2186835' },
        { name: 'Turmeric Powder', price: 1.99, unit: '100g', image: 'https://images.unsplash.com/photo-1615485243323-7489da1076b7' },
        { name: 'Black Pepper Correns', price: 3.25, unit: '100g', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad' },
        { name: 'Balsamic Vinegar', price: 5.99, unit: '500ml', image: 'https://images.unsplash.com/photo-1590540179852-2110a54f813a' },
    ],
    'baby-care': [
        { name: 'Diapers Premium', price: 29.99, unit: '80pcs', image: 'https://images.unsplash.com/photo-1622329584319-e5879a836854' },
        { name: 'Sensitive Wipes', price: 5.50, unit: '3x60pcs', image: 'https://images.unsplash.com/photo-1627384113972-f4c03926658d' },
        { name: 'Baby Shampoo', price: 4.99, unit: '300ml', image: 'https://images.unsplash.com/photo-1632766329388-75b871987d69' },
        { name: 'Baby Formula Step 1', price: 18.99, unit: '800g', image: 'https://images.unsplash.com/photo-1616421448102-36c117d7c672' },
    ],
    'household': [
        { name: 'Dish Soap', price: 2.49, unit: '500ml', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1' },
        { name: 'Laundry Detergent', price: 11.99, unit: '3L', image: 'https://images.unsplash.com/photo-1584622781568-f974c0b49741' },
        { name: 'Kitchen Towels', price: 4.50, unit: '2pcs', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246' },
        { name: 'Glass Cleaner', price: 3.29, unit: '750ml', image: 'https://images.unsplash.com/photo-1584622781514-633045697669' },
        { name: 'Eco Toilet Paper', price: 6.99, unit: '8-roll', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a' },
    ]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
    console.log('🚀 Starting seed process...')

    try {
        // 1. Clear existing data
        console.log('🧹 Clearing existing data...')
        await prisma.payment.deleteMany()
        await prisma.orderAddress.deleteMany()
        await prisma.orderItem.deleteMany()
        await prisma.order.deleteMany()
        await prisma.cartItem.deleteMany()
        await prisma.cart.deleteMany()
        await prisma.inventoryLog.deleteMany()
        await prisma.productVariant.deleteMany()
        await prisma.productImage.deleteMany()
        await prisma.review.deleteMany()
        await prisma.product.deleteMany()
        await prisma.category.deleteMany()
        await prisma.banner.deleteMany()
        await prisma.address.deleteMany()
        await prisma.account.deleteMany()
        await prisma.session.deleteMany()
        await prisma.verificationToken.deleteMany()
        await prisma.user.deleteMany()

        // 2. Create Users
        console.log('👥 Creating users...')
        const hashedPassword = await bcrypt.hash('password123', 10)
        const adminPassword = await bcrypt.hash('admin123', 10)

        const admin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'System Admin',
                password: adminPassword,
                role: 'ADMIN',
                phone: '+1888777666',
                addresses: {
                    create: {
                        type: 'OFFICE',
                        street: 'Tech Plaza, 101',
                        city: 'San Francisco',
                        state: 'CA',
                        zipCode: '94103',
                        country: 'USA',
                        isDefault: true
                    }
                }
            }
        })

        const customers = []
        for (let i = 1; i <= 15; i++) {
            const customer = await prisma.user.create({
                data: {
                    email: `user${i}@example.com`,
                    name: `Customer ${i}`,
                    password: hashedPassword,
                    role: 'CUSTOMER',
                    phone: `+12345678${i}`,
                    addresses: {
                        create: {
                            type: 'HOME',
                            street: `${i * 10} Greenway Road`,
                            city: 'Brooklyn',
                            state: 'NY',
                            zipCode: '11201',
                            country: 'USA',
                            isDefault: true
                        }
                    }
                }
            })
            customers.push(customer)
        }

        // Add a demo customer
        const demoUser = await prisma.user.create({
            data: {
                email: 'demo@example.com',
                name: 'John Demo',
                password: hashedPassword,
                role: 'CUSTOMER',
                phone: '+1555000999',
                addresses: {
                    create: {
                        type: 'HOME',
                        street: '42 Wallaby Way',
                        city: 'Sydney',
                        state: 'NSW',
                        zipCode: '2000',
                        country: 'Australia',
                        isDefault: true
                    }
                }
            }
        })
        customers.push(demoUser)

        // 3. Create Categories
        console.log('📂 Creating categories...')
        const categories = []
        for (const cat of CATEGORIES_DATA) {
            const category = await prisma.category.create({
                data: cat
            })
            categories.push(category)
        }

        // 4. Create Products
        console.log('🛒 Generating products...')
        const allProductVariants = []
        for (const category of categories) {
            const templates = PRODUCT_TEMPLATES[category.slug] || [
                { name: `Generic ${category.name}`, price: 10, unit: 'pc', image: category.image }
            ]

            // Create ~20 products per category
            for (let i = 1; i <= 20; i++) {
                const template = templates[(i - 1) % templates.length]
                const suffix = i > templates.length ? ` (Var ${i})` : ''
                const variationRatio = 1 + (Math.random() * 0.4 - 0.2) // +/- 20%

                const imageUrl = template.image.includes('?')
                    ? template.image
                    : `${template.image}?auto=format&fit=crop&q=80&w=400`

                const product = await prisma.product.create({
                    data: {
                        name: `${template.name}${suffix}`,
                        slug: `${category.slug}-${template.name.toLowerCase().replace(/ /g, '-')}-${i}`,
                        description: `High quality ${template.name.toLowerCase()} specially sourced for our customers.`,
                        categoryId: category.id,
                        featured: i <= 2,
                        images: {
                            create: { imageUrl }
                        },
                        variants: {
                            create: {
                                name: template.unit,
                                price: parseFloat((template.price * variationRatio).toFixed(2)),
                                originalPrice: i % 4 === 0 ? parseFloat((template.price * variationRatio * 1.2).toFixed(2)) : null,
                                stock: getRandomInt(0, 500),
                                sku: `${category.slug.slice(0, 3)}-${template.name.slice(0, 3)}-${i}`
                            }
                        }
                    },
                    include: {
                        variants: true
                    }
                })
                allProductVariants.push(...product.variants)
            }
        }

        // 5. Create Order History
        console.log('📦 Generating order history (100 orders)...')
        const statuses = ['DELIVERED', 'PROCESSING', 'SHIPPED', 'CANCELLED', 'PENDING']

        for (let i = 0; i < 100; i++) {
            const customer = customers[getRandomInt(0, customers.length - 1)]
            const numItems = getRandomInt(1, 6)
            const orderVariants = []

            // Pick unique variants for this order
            for (let j = 0; j < numItems; j++) {
                const v = allProductVariants[getRandomInt(0, allProductVariants.length - 1)]
                if (!orderVariants.find(ov => ov.id === v.id)) {
                    orderVariants.push(v)
                }
            }

            const itemsData = orderVariants.map(v => ({
                variantId: v.id,
                quantity: getRandomInt(1, 4),
                price: v.price
            }))

            const subtotal = itemsData.reduce((acc, item) => acc + (item.price * item.quantity), 0)
            const deliveryFee = subtotal > 50 ? 0 : 5
            const tax = subtotal * 0.08
            const total = subtotal + tax + deliveryFee

            const userAddress = await prisma.address.findFirst({ where: { userId: customer.id } })

            const createdAt = new Date()
            createdAt.setDate(createdAt.getDate() - getRandomInt(0, 60)) // last 60 days

            await prisma.order.create({
                data: {
                    userId: customer.id,
                    status: statuses[getRandomInt(0, statuses.length - 1)],
                    subtotal: parseFloat(subtotal.toFixed(2)),
                    tax: parseFloat(tax.toFixed(2)),
                    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
                    total: parseFloat(total.toFixed(2)),
                    paymentMethod: 'Credit Card',
                    paymentStatus: 'PAID',
                    address: {
                        create: {
                            street: userAddress.street,
                            city: userAddress.city,
                            state: userAddress.state,
                            zipCode: userAddress.zipCode,
                            country: userAddress.country
                        }
                    },
                    createdAt,
                    items: {
                        create: itemsData
                    }
                }
            })
        }

        // 6. Create Banners
        console.log('🖼️ Creating banners...')
        for (const banner of BANNERS_DATA) {
            await prisma.banner.create({
                data: banner
            })
        }

        console.log('✅ Seeding completed successfully!')
        console.log('--------------------------------')
        console.log(`Summary:`)
        console.log(`- Categories: ${categories.length}`)
        console.log(`- Variants:   ${allProductVariants.length}`)
        console.log(`- Banners:    ${BANNERS_DATA.length}`)
        console.log(`- Users:      ${customers.length + 1}`)
        console.log(`- Orders:     100`)
        console.log('--------------------------------')
        console.log('Demo Credentials:')
        console.log('  Customer: demo@example.com / password123')
        console.log('  Admin:    admin@example.com / admin123')

    } catch (error) {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
