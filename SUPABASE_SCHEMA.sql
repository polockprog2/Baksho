-- Supabase Schema for E-Commerce Site
-- Generated from Prisma schema.prisma
-- Run this in Supabase SQL Editor after setting up your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');
CREATE TYPE "OrderStatus" AS ENUM ('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'IN_TRANSIT');

-- Users table
CREATE TABLE "User" (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    image TEXT,
    password TEXT,
    role "Role" NOT NULL DEFAULT 'CUSTOMER',
    phone TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (for OAuth)
CREATE TABLE "Account" (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    UNIQUE (provider, "providerAccountId")
);

-- Sessions table
CREATE TABLE "Session" (
    id TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Verification tokens
CREATE TABLE "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMP(3) NOT NULL,
    UNIQUE (identifier, token)
);

-- Categories table
CREATE TABLE "Category" (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    image TEXT,
    description TEXT,
    badge TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Banners table
CREATE TABLE "Banner" (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    "imageUrl" TEXT NOT NULL,
    link TEXT,
    type TEXT NOT NULL DEFAULT 'ad',
    active BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE "Product" (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    discount DOUBLE PRECISION NOT NULL DEFAULT 0,
    rating DOUBLE PRECISION NOT NULL DEFAULT 0,
    reviews INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    unit TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    stock INTEGER NOT NULL DEFAULT 100,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"(id)
);

-- Orders table
CREATE TABLE "Order" (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    status "OrderStatus" NOT NULL DEFAULT 'PROCESSING',
    subtotal DOUBLE PRECISION NOT NULL,
    tax DOUBLE PRECISION NOT NULL,
    "deliveryFee" DOUBLE PRECISION NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "estimatedDelivery" TIMESTAMP(3),
    "deliveryAddressId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id),
    CONSTRAINT "Order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "Address"(id)
);

-- Order Items table
CREATE TABLE "OrderItem" (
    id TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id)
);

-- Addresses table
CREATE TABLE "Address" (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'HOME',
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'USA',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_slug_idx" ON "Product"(slug);
CREATE INDEX "Product_featured_idx" ON "Product"(featured);
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"(status);
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX "Address_userId_idx" ON "Address"("userId");
CREATE INDEX "Category_slug_idx" ON "Category"(slug);
CREATE INDEX "Banner_active_idx" ON "Banner"(active);

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only read their own data
CREATE POLICY "Users can read own data" ON "User"
    FOR SELECT USING (id = current_user_id());

-- Users can only update their own data
CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE USING (id = current_user_id()) 
    WITH CHECK (id = current_user_id());

-- Users can only read their own orders
CREATE POLICY "Users can read own orders" ON "Order"
    FOR SELECT USING ("userId" = current_user_id());

-- Users can only read their own addresses
CREATE POLICY "Users can read own addresses" ON "Address"
    FOR SELECT USING ("userId" = current_user_id());

-- Admin can read all data (adjust based on your role implementation)
-- This is a basic policy - you may need to enhance it

-- Public tables (accessible to all authenticated users)
-- Categories and Banners are readable by all
-- No RLS policies needed if public access is desired, or:
-- ALTER TABLE "Category" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Banner" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
