# E-commerce Backend

Complete backend with database schema using Next.js API Routes, Prisma ORM, and PostgreSQL.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: JavaScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Auth**: NextAuth.js

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Set `NEXTAUTH_SECRET` for authentication

3. **Database Setup**
   - Generate Prisma client:
     ```bash
     npx prisma generate
     ```
   - Run migrations to create tables:
     ```bash
     npx prisma migrate dev --name init
     ```
   - Seed the database with sample data:
     ```bash
     npx prisma db seed
     ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

- **Auth**:
  - `POST /api/auth/signin` - Authentication
- **Products**:
  - `GET /api/products` - Fetch all products (with filters)
  - `GET /api/products/[id]` - Fetch single product
  - `POST /api/products` - Create product (Admin)
  - `PATCH /api/products/[id]` - Update product (Admin)
  - `DELETE /api/products/[id]` - Delete product (Admin)
- **Categories**:
  - `GET /api/categories` - Fetch all categories
- **Orders**:
  - `GET /api/orders` - Fetch user's orders
  - `POST /api/orders` - Create new order
