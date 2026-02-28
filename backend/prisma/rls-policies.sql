-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR E-COMMERCE APPLICATION
-- ============================================================================
-- This file contains all RLS policies to secure the database tables
-- Run this after creating the tables with Prisma

-- ============================================================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Banner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Address" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. USER TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public."User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public."User"
  FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public."User"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ============================================================================
-- 3. ACCOUNT TABLE POLICIES
-- ============================================================================

-- Users can view their own accounts
CREATE POLICY "Users can view own accounts"
  ON public."Account"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can update their own accounts
CREATE POLICY "Users can update own accounts"
  ON public."Account"
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- ============================================================================
-- 4. SESSION TABLE POLICIES
-- ============================================================================

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON public."Session"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- 5. VERIFICATION TOKEN TABLE POLICIES
-- ============================================================================

-- Verification tokens are only accessible server-side
-- No direct client access
CREATE POLICY "Verification tokens are server-only"
  ON public."VerificationToken"
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================================================
-- 6. CATEGORY TABLE POLICIES
-- ============================================================================

-- Everyone can view categories (public data)
CREATE POLICY "Categories are publicly readable"
  ON public."Category"
  FOR SELECT
  USING (true);

-- Only admins can insert categories
CREATE POLICY "Only admins can create categories"
  ON public."Category"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- Only admins can update categories
CREATE POLICY "Only admins can update categories"
  ON public."Category"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- Only admins can delete categories
CREATE POLICY "Only admins can delete categories"
  ON public."Category"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ============================================================================
-- 7. BANNER TABLE POLICIES
-- ============================================================================

-- Everyone can view banners (public data)
CREATE POLICY "Banners are publicly readable"
  ON public."Banner"
  FOR SELECT
  USING (true);

-- Only admins can manage banners
CREATE POLICY "Only admins can manage banners"
  ON public."Banner"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can update banners"
  ON public."Banner"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can delete banners"
  ON public."Banner"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ============================================================================
-- 8. PRODUCT TABLE POLICIES
-- ============================================================================

-- Everyone can view products (public data)
CREATE POLICY "Products are publicly readable"
  ON public."Product"
  FOR SELECT
  USING (true);

-- Only admins can create products
CREATE POLICY "Only admins can create products"
  ON public."Product"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- Only admins can update products
CREATE POLICY "Only admins can update products"
  ON public."Product"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- Only admins can delete products
CREATE POLICY "Only admins can delete products"
  ON public."Product"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ============================================================================
-- 9. ORDER TABLE POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public."Order"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public."Order"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON public."Order"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Only admins can update order status
CREATE POLICY "Only admins can update orders"
  ON public."Order"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ============================================================================
-- 10. ORDER ITEM TABLE POLICIES
-- ============================================================================

-- Users can view items in their own orders
CREATE POLICY "Users can view own order items"
  ON public."OrderItem"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId" AND o."userId" = auth.uid()::text
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON public."OrderItem"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- Users can create items for their own orders
CREATE POLICY "Users can create order items for own orders"
  ON public."OrderItem"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId" AND o."userId" = auth.uid()::text
    )
  );

-- ============================================================================
-- 11. ADDRESS TABLE POLICIES
-- ============================================================================

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
  ON public."Address"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create their own addresses
CREATE POLICY "Users can create own addresses"
  ON public."Address"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
  ON public."Address"
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
  ON public."Address"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- Admins can view all addresses
CREATE POLICY "Admins can view all addresses"
  ON public."Address"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ============================================================================
-- 12. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_user_id ON public."User"(id);
CREATE INDEX idx_account_user_id ON public."Account"("userId");
CREATE INDEX idx_session_user_id ON public."Session"("userId");
CREATE INDEX idx_order_user_id ON public."Order"("userId");
CREATE INDEX idx_order_item_order_id ON public."OrderItem"("orderId");
CREATE INDEX idx_address_user_id ON public."Address"("userId");
CREATE INDEX idx_product_category_id ON public."Product"("categoryId");

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. This assumes you're using Supabase Auth (auth.uid())
-- 2. If using a different auth system, replace auth.uid()::text with your user ID column
-- 3. Test all policies thoroughly before deploying to production
-- 4. Consider adding audit logging for sensitive operations
-- 5. Regularly review and update policies as your application evolves
