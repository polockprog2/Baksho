/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Seed Configuration
const CATEGORIES_DATA = [
    { name: 'Vegetables', slug: 'vegetables', icon: '🥬', description: 'Fresh vegetables delivered daily', image: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Fruits', slug: 'fruits', icon: '🍎', description: 'Fresh fruits and berries', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛', description: 'Fresh dairy and farm eggs', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Meat & Fish', slug: 'meat-fish', icon: '🥩', description: 'Quality meat and fresh fish', image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Bakery', slug: 'bakery', icon: '🍞', description: 'Freshly baked bread and pastries', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Snacks & Drinks', slug: 'snacks-drinks', icon: '🍿', description: 'Popular snacks and refreshments', image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Rice & Grains', slug: 'rice-grains', icon: '🍚', description: 'Essential rice and grains', image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Spices & Oil', slug: 'spices-oil', icon: '🌶️', description: 'Authentic spices and cooking oil', image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Baby Care', slug: 'baby-care', icon: '👶', description: 'Products for your little ones', image: 'https://images.pexels.com/photos/3875089/pexels-photo-3875089.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Household', slug: 'household', icon: '🧼', description: 'Cleaning and home essentials', image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=600' },
]

const BANNERS_DATA = [
    {
        title: 'Fresh Summer Deals',
        imageUrl: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=1200',
        link: '/products?category=fruits',
        active: true
    },
    {
        title: 'Organic Vegetables',
        imageUrl: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=1200',
        link: '/products?category=vegetables',
        active: true
    },
    {
        title: 'Premium Steaks',
        imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1200',
        link: '/products?category=meat-fish',
        active: true
    }
]

const PRODUCT_TEMPLATES = {
    'vegetables': [
        { name: 'Fresh Tomatoes', price: 2.99, unit: 'kg', image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Red Onions', price: 1.49, unit: 'kg', image: 'https://images.pexels.com/photos/4197447/pexels-photo-4197447.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Green Cucumber', price: 1.25, unit: 'kg', image: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Organic Spinach', price: 3.50, unit: 'bunch', image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Bell Peppers', price: 4.99, unit: 'kg', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Fresh Potatoes', price: 1.99, unit: 'kg', image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Broccoli', price: 2.49, unit: 'pc', image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Bio-Carrots', price: 1.89, unit: 'kg', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Garlic', price: 0.99, unit: 'net', image: 'https://images.pexels.com/photos/928251/pexels-photo-928251.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'fruits': [
        { name: 'Gala Apples', price: 3.99, unit: 'kg', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Yellow Bananas', price: 0.99, unit: 'kg', image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Sweet Oranges', price: 2.49, unit: 'kg', image: 'https://images.pexels.com/photos/42059/citrus-diet-food-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Fresh Grapes', price: 5.99, unit: 'kg', image: 'https://images.pexels.com/photos/60021/grapes-wine-fruit-vines-60021.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Red Strawberries', price: 4.50, unit: 'pack', image: 'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Conference Pears', price: 3.29, unit: 'kg', image: 'https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Blueberries', price: 3.99, unit: '125g', image: 'https://images.pexels.com/photos/1395958/pexels-photo-1395958.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Avocado', price: 1.49, unit: 'pc', image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'dairy-eggs': [
        { name: 'Whole Milk', price: 3.49, unit: '1L', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Farm Eggs', price: 4.99, unit: '12pcs', image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Natural Yogurt', price: 2.75, unit: '500g', image: 'https://images.pexels.com/photos/414262/pexels-photo-414262.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Butter', price: 3.99, unit: '250g', image: 'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Gouda Cheese', price: 4.50, unit: '400g', image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Bio-Oat Milk', price: 2.29, unit: '1L', image: 'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'meat-fish': [
        { name: 'Chicken Breast', price: 12.99, unit: 'kg', image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Salmon Fillet', price: 24.99, unit: 'kg', image: 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Beef Steak', price: 18.50, unit: 'kg', image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'German Bratwurst', price: 7.99, unit: '500g', image: 'https://images.pexels.com/photos/8753710/pexels-photo-8753710.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Salami Milano', price: 3.50, unit: '100g', image: 'https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'bakery': [
        { name: 'Fresh Baguette', price: 1.50, unit: 'pc', image: 'https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Croissants', price: 4.99, unit: '4pcs', image: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Sourdough Bread', price: 4.50, unit: 'pc', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'German Rye Bread', price: 3.99, unit: '500g', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Traditional Brezel', price: 1.20, unit: 'pc', image: 'https://images.pexels.com/photos/59594/pretzels-alsatian-specialty-food-59594.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'snacks-drinks': [
        { name: 'Potato Chips', price: 2.25, unit: '150g', image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Sparkling Water', price: 0.99, unit: '1.5L', image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Dark Chocolate', price: 3.50, unit: '100g', image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Haribo Goldbears', price: 1.49, unit: '200g', image: 'https://images.pexels.com/photos/4016579/pexels-photo-4016579.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Apple Spritzer', price: 1.99, unit: '1L', image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Premium Coffee Beans', price: 15.99, unit: '1kg', image: 'https://images.pexels.com/photos/942800/pexels-photo-942800.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'rice-grains': [
        { name: 'Basmati Rice', price: 14.99, unit: '5kg', image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Red Lentils', price: 3.50, unit: '1kg', image: 'https://images.pexels.com/photos/8510277/pexels-photo-8510277.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Chickpeas', price: 2.99, unit: '1kg', image: 'https://images.pexels.com/photos/6316515/pexels-photo-6316515.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Whole Wheat Flour', price: 5.49, unit: '2kg', image: 'https://images.pexels.com/photos/5765/flour-powder-wheat-jar.jpg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Spaghetti No.5', price: 1.99, unit: '500g', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Bio-Muesli', price: 4.50, unit: '750g', image: 'https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'spices-oil': [
        { name: 'Extra Virgin Olive Oil', price: 12.99, unit: '1L', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Sunflower Oil', price: 4.50, unit: '2L', image: 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Turmeric Powder', price: 1.99, unit: '100g', image: 'https://images.pexels.com/photos/4198370/pexels-photo-4198370.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Black Pepper Correns', price: 3.25, unit: '100g', image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Balsamic Vinegar', price: 5.99, unit: '500ml', image: 'https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'baby-care': [
        { name: 'Diapers Premium', price: 29.99, unit: '80pcs', image: 'https://images.pexels.com/photos/3875089/pexels-photo-3875089.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Sensitive Wipes', price: 5.50, unit: '3x60pcs', image: 'https://images.pexels.com/photos/3875089/pexels-photo-3875089.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Baby Shampoo', price: 4.99, unit: '300ml', image: 'https://images.pexels.com/photos/3875089/pexels-photo-3875089.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Baby Formula Step 1', price: 18.99, unit: '800g', image: 'https://images.pexels.com/photos/3875089/pexels-photo-3875089.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    'household': [
        { name: 'Dish Soap', price: 2.49, unit: '500ml', image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Laundry Detergent', price: 11.99, unit: '3L', image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Kitchen Towels', price: 4.50, unit: '2pcs', image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Glass Cleaner', price: 3.29, unit: '750ml', image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Eco Toilet Paper', price: 6.99, unit: '8-roll', image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400' },
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
