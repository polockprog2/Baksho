const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backup() {
    console.log('Starting database backup...');
    try {
        const products = await prisma.product.findMany();
        const categories = await prisma.category.findMany();
        const orders = await prisma.order.findMany({ include: { items: true } });
        const users = await prisma.user.findMany();
        const addresses = await prisma.address.findMany();
        const banners = await prisma.banner.findMany();

        const backupData = {
            products,
            categories,
            orders,
            users,
            addresses,
            banners
        };

        const backupPath = path.join(__dirname, 'backup.json');
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
        console.log(`Backup saved to ${backupPath}`);
    } catch (error) {
        console.error('Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

backup();
