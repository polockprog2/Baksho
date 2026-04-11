# E-Commerce Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     E-COMMERCE APPLICATION                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│   FRONTEND (Port 3000)   │         │   BACKEND (Port 3001)    │
│   ─────────────────────  │         │   ─────────────────────  │
│                          │         │                          │
│  • React Components      │◄───────►│  • Next.js API Routes    │
│  • Context State         │  HTTP   │  • Prisma ORM            │
│  • Local Storage         │  JSON   │  • NextAuth.js           │
│  • Tailwind CSS          │         │  • Zod Validation        │
│                          │         │  • bcryptjs              │
└──────────────────────────┘         └──────────────────────────┘
         │                                      │
         │                                      │
         └──────────────────┬───────────────────┘
                            │
                    ┌───────▼────────┐
                    │  PostgreSQL    │
                    │   Database     │
                    └────────────────┘
```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Pages (App Router)                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • / (Home)                                          │  │
│  │  • /products (Product Listing)                       │  │
│  │  • /products/[id] (Product Details)                  │  │
│  │  • /cart (Shopping Cart)                             │  │
│  │  • /checkout (Checkout)                              │  │
│  │  • /login (Login)                                    │  │
│  │  • /register (Registration)                          │  │
│  │  • /profile (User Profile)                           │  │
│  │  • /admin/* (Admin Pages)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │           React Components                           │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Navbar, Footer, ProductCard, CartItem            │  │
│  │  • Forms, Modals, Spinners, Overlays                │  │
│  │  • Admin Tables, Charts, Dashboards                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         Context & State Management                   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • UserContext (Authentication, Profile)            │  │
│  │  • CartContext (Shopping Cart)                       │  │
│  │  • LanguageContext (i18n)                            │  │
│  │  • UIContext (UI State)                              │  │
│  │  • BannerContext (Banners)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         API Client Layer                             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • product.api.js (Product endpoints)                │  │
│  │  • order.api.js (Order endpoints)                    │  │
│  │  • dashboard.api.js (Dashboard endpoints)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         Local Storage                                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • user (User data)                                  │  │
│  │  • cart (Shopping cart items)                        │  │
│  │  • language (Selected language)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           API Routes (Route Handlers)                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  Authentication                                     │  │
│  │  ├── POST /api/auth/login                           │  │
│  │  └── POST /api/auth/register                        │  │
│  │                                                      │  │
│  │  Products                                           │  │
│  │  ├── GET /api/products                              │  │
│  │  ├── GET /api/products/{id}                         │  │
│  │  ├── POST /api/products                             │  │
│  │  ├── PATCH /api/products/{id}                       │  │
│  │  └── DELETE /api/products/{id}                      │  │
│  │                                                      │  │
│  │  Orders                                             │  │
│  │  ├── GET /api/orders                                │  │
│  │  ├── GET /api/orders/{id}                           │  │
│  │  ├── POST /api/orders                               │  │
│  │  └── PATCH /api/orders/{id}                         │  │
│  │                                                      │  │
│  │  Users                                              │  │
│  │  ├── GET /api/users                                 │  │
│  │  ├── GET /api/users/{id}                            │  │
│  │  └── PATCH /api/users/{id}                          │  │
│  │                                                      │  │
│  │  Addresses                                          │  │
│  │  ├── GET /api/users/{id}/addresses                  │  │
│  │  ├── POST /api/users/{id}/addresses                 │  │
│  │  ├── PATCH /api/users/{id}/addresses/{id}           │  │
│  │  └── DELETE /api/users/{id}/addresses/{id}          │  │
│  │                                                      │  │
│  │  Dashboard                                          │  │
│  │  └── GET /api/dashboard/stats                       │  │
│  │                                                      │  │
│  │  Categories                                         │  │
│  │  └── GET /api/categories                            │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         Middleware & Utilities                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • middleware.js (CORS, Headers)                     │  │
│  │  • auth.js (NextAuth Configuration)                 │  │
│  │  • prisma.js (Database Client)                      │  │
│  │  • validations.js (Zod Schemas)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         Business Logic Layer                         │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Authentication & Authorization                    │  │
│  │  • Data Validation                                   │  │
│  │  • Error Handling                                    │  │
│  │  • Database Transactions                             │  │
│  │  • Inventory Management                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         Prisma ORM Layer                             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Query Building                                    │  │
│  │  • Relationship Management                           │  │
│  │  • Transaction Support                               │  │
│  │  • Type Safety                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │         Database (PostgreSQL)                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Users, Products, Orders, Categories              │  │
│  │  • Addresses, OrderItems, Sessions                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### User Registration Flow
```
Frontend                          Backend                    Database
   │                                │                           │
   ├─ POST /auth/register ────────►│                           │
   │  (email, password, name)       │                           │
   │                                ├─ Validate Input          │
   │                                ├─ Hash Password           │
   │                                ├─ Check Email Exists      │
   │                                ├─ Create User ───────────►│
   │                                │                           │
   │◄─ User Object ────────────────┤                           │
   │  (without password)            │                           │
   │                                │                           │
   ├─ Store in localStorage        │                           │
   ├─ Store in UserContext         │                           │
   └─ Redirect to Home             │                           │
```

### Product Purchase Flow
```
Frontend                          Backend                    Database
   │                                │                           │
   ├─ Add to Cart (localStorage)   │                           │
   │                                │                           │
   ├─ POST /orders ───────────────►│                           │
   │  (items, address, payment)     │                           │
   │                                ├─ Validate Order          │
   │                                ├─ Create Order ──────────►│
   │                                │                           │
   │                                ├─ Create OrderItems ─────►│
   │                                │                           │
   │                                ├─ Update Stock ──────────►│
   │                                │                           │
   │◄─ Order Confirmation ─────────┤                           │
   │                                │                           │
   ├─ Clear Cart                   │                           │
   ├─ Show Success Message         │                           │
   └─ Redirect to Order Page       │                           │
```

### Admin Dashboard Flow
```
Frontend                          Backend                    Database
   │                                │                           │
   ├─ GET /dashboard/stats ───────►│                           │
   │                                ├─ Check Admin Role        │
   │                                ├─ Count Orders ──────────►│
   │                                │                           │
   │                                ├─ Sum Revenue ───────────►│
   │                                │                           │
   │                                ├─ Count Customers ───────►│
   │                                │                           │
   │                                ├─ Count Low Stock ───────►│
   │                                │                           │
   │◄─ Dashboard Data ─────────────┤                           │
   │  (KPIs, Charts, Orders)        │                           │
   │                                │                           │
   └─ Render Dashboard             │                           │
```

---

## Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │    User      │         │   Product    │                │
│  ├──────────────┤         ├──────────────┤                │
│  │ id (PK)      │         │ id (PK)      │                │
│  │ email        │         │ name         │                │
│  │ password     │         │ price        │                │
│  │ name         │         │ discount     │                │
│  │ phone        │         │ stock        │                │
│  │ role         │         │ categoryId   │                │
│  │ createdAt    │         │ createdAt    │                │
│  └──────────────┘         └──────────────┘                │
│         │                         │                        │
│         │ 1:N                     │ N:1                    │
│         │                         │                        │
│  ┌──────▼──────────┐      ┌──────▼──────────┐             │
│  │    Order        │      │    Category     │             │
│  ├─────────────────┤      ├─────────────────┤             │
│  │ id (PK)         │      │ id (PK)         │             │
│  │ userId (FK)     │      │ name            │             │
│  │ status          │      │ slug            │             │
│  │ total           │      │ icon            │             │
│  │ tax             │      │ createdAt       │             │
│  │ deliveryFee     │      └─────────────────┘             │
│  │ createdAt       │                                      │
│  └─────────────────┘                                      │
│         │                                                  │
│         │ 1:N                                              │
│         │                                                  │
│  ┌──────▼──────────┐      ┌──────────────┐               │
│  │   OrderItem     │      │   Address    │               │
│  ├─────────────────┤      ├──────────────┤               │
│  │ id (PK)         │      │ id (PK)      │               │
│  │ orderId (FK)    │      │ userId (FK)  │               │
│  │ productId (FK)  │      │ street       │               │
│  │ quantity        │      │ city         │               │
│  │ price           │      │ state        │               │
│  └─────────────────┘      │ zipCode      │               │
│                           │ isDefault    │               │
│                           │ createdAt    │               │
│                           └──────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### Typical API Request
```
1. Frontend makes HTTP request
   ├─ Method: GET/POST/PATCH/DELETE
   ├─ URL: http://localhost:3001/api/...
   ├─ Headers: Content-Type: application/json
   └─ Body: JSON data (if applicable)

2. Backend receives request
   ├─ Route handler processes request
   ├─ Middleware applies (CORS, etc.)
   ├─ Authentication/Authorization checked
   ├─ Input validation performed
   └─ Business logic executed

3. Database operations
   ├─ Query/Insert/Update/Delete
   ├─ Relationships resolved
   └─ Transactions committed

4. Response sent to frontend
   ├─ Status Code: 200/201/400/401/404/500
   ├─ Headers: Content-Type: application/json
   └─ Body: JSON response or error

5. Frontend processes response
   ├─ Check status code
   ├─ Parse JSON
   ├─ Update state/context
   ├─ Update UI
   └─ Show success/error message
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: CORS Protection                                  │
│  ├─ Whitelist allowed origins                              │
│  ├─ Restrict HTTP methods                                  │
│  └─ Control headers                                        │
│                                                             │
│  Layer 2: Input Validation                                 │
│  ├─ Zod schema validation                                  │
│  ├─ Type checking                                          │
│  └─ Sanitization                                           │
│                                                             │
│  Layer 3: Authentication                                   │
│  ├─ Email/password verification                            │
│  ├─ Password hashing (bcryptjs)                            │
│  └─ Session management                                     │
│                                                             │
│  Layer 4: Authorization                                    │
│  ├─ Role-based access control                              │
│  ├─ User ownership validation                              │
│  └─ Admin-only endpoints                                   │
│                                                             │
│  Layer 5: Database Security                                │
│  ├─ Parameterized queries (Prisma)                         │
│  ├─ SQL injection prevention                               │
│  └─ Transaction support                                    │
│                                                             │
│  Layer 6: Error Handling                                   │
│  ├─ No sensitive info in errors                            │
│  ├─ Proper HTTP status codes                               │
│  └─ Logging for debugging                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Load Balancer / Reverse Proxy           │  │
│  │              (Nginx / Apache)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐              │
│         │                 │                 │              │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐       │
│  │  Frontend   │  │  Frontend   │  │  Frontend   │       │
│  │  Instance 1 │  │  Instance 2 │  │  Instance N │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
│         ┌─────────────────┬─────────────────┐              │
│         │                 │                 │              │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐       │
│  │  Backend    │  │  Backend    │  │  Backend    │       │
│  │  Instance 1 │  │  Instance 2 │  │  Instance N │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                           │                                 │
│                    ┌──────▼──────┐                         │
│                    │  PostgreSQL  │                         │
│                    │  Database    │                         │
│                    │  (Replicated)│                         │
│                    └──────────────┘                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CDN (Static Assets)                     │  │
│  │              (Images, CSS, JS)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

```
Frontend Stack
├── Framework: Next.js 16.1.6
├── UI Library: React 19.2.3
├── Styling: Tailwind CSS 4
├── State: React Context
├── HTTP: Fetch API
└── Storage: localStorage

Backend Stack
├── Framework: Next.js 16.1.6
├── Database: PostgreSQL
├── ORM: Prisma 7.4.0
├── Auth: NextAuth.js 4.24.13
├── Validation: Zod 4.3.6
├── Hashing: bcryptjs 3.0.3
└── Runtime: Node.js 18+

DevOps Stack
├── Version Control: Git
├── Package Manager: npm
├── Database: PostgreSQL
├── Environment: Node.js
└── Deployment: Docker (optional)
```

---

## Scalability Considerations

```
Horizontal Scaling
├── Multiple frontend instances
├── Multiple backend instances
├── Load balancer distribution
└── Session management

Vertical Scaling
├── Increase server resources
├── Database optimization
├── Query caching
└── Connection pooling

Database Scaling
├── Read replicas
├── Sharding (if needed)
├── Indexing strategy
└── Query optimization

Caching Strategy
├── Frontend: localStorage, sessionStorage
├── Backend: Redis (optional)
├── CDN: Static assets
└── Browser: HTTP caching
```

---

## Monitoring & Logging

```
Frontend Monitoring
├── Error tracking (Sentry)
├── Performance monitoring
├── User analytics
└── Network monitoring

Backend Monitoring
├── Application logs
├── Error tracking
├── Performance metrics
├── Database monitoring
├── API response times
└── Error rates

Database Monitoring
├── Query performance
├── Connection pool
├── Disk usage
├── Backup status
└── Replication lag
```

---

## Conclusion

This architecture provides:
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ Reliability

The separation of concerns between frontend and backend allows for independent scaling and deployment of each component.


### Project Optimization & Improvements: Summary Plan
Here’s a prioritized plan based on a comprehensive review of your ecommerce-site01 project:

## Critical Security & Stability Fixes
Remove all secrets from version control; rotate exposed credentials immediately.
Enforce rate limiting in all environments (never bypass in dev).
Standardize error handling: replace all console.error with logger.error, never expose stack traces in production.
Add missing database indexes for frequently queried fields (e.g., User.email, Product.slug, Product.categoryId).
## Major Code & Architecture Improvements
Refactor repeated authorization checks into middleware wrappers.
Add comprehensive test coverage (unit, integration, E2E, auth flows).
Complete and enforce email verification flow.
Gradually migrate to TypeScript or add JSDoc for type safety.
Optimize image loading (lazy loading, priority hints, format optimization).
Add error boundaries to frontend.
Optimize React context usage (split contexts, useCallback, consider Zustand/Jotai).
Add request logging middleware to backend.
Implement or remove unused notification system.
Debounce frontend search API calls.
Add backend health check endpoint.
Add pagination to admin list pages.
Minor Enhancements & Cleanups
Remove or replace backend legacy page.
Standardize frontend API error handling and user notifications.
Document and clean up unused database models/fields.
Enable ESLint console rules for production.
Add loading states to forms.
Add environment variable validation at startup.
Batch parallel API calls in frontend.
Add API response documentation (Swagger/OpenAPI or JSDoc).
Explore React Suspense/streaming for faster FCP.
## Verification
Secrets are not present in version control; .env is in .gitignore
Rate limiting and error handling are consistent across all routes
Database queries on indexed fields are performant
Test coverage reports >70% for critical paths
Email verification is enforced on login
Frontend images are optimized and lazy-loaded
Error boundaries catch and log component errors
Context updates do not cause unnecessary re-renders
Health check endpoint returns healthy status
Admin lists paginate correctly
Further Considerations
Use a secrets manager for production deployments
Consider a state management library for complex frontend state
Add OpenAPI/Swagger docs for easier frontend-backend integration