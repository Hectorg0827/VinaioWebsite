-- Migration: Portal v5 Final Hardening & Transactional Schema

-- 0. Core Customer Profiles (One-to-one with Auth User)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    rep_name TEXT,
    license_number TEXT,
    account_number TEXT UNIQUE, -- The QuickBooks ID
    balance NUMERIC NOT NULL DEFAULT 0,
    credit_limit NUMERIC NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, suspended, pending
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view their own profile" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins full access to customers" ON customers FOR ALL TO service_role USING (true);

-- 1. Portal Access Requests (Public submits, Admin reads)
CREATE TABLE IF NOT EXISTS portal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    license_number TEXT,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portal_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit requests" ON portal_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can read/update requests" ON portal_requests FOR ALL TO service_role USING (true);

-- 2. Invoices (Daily sync from QBD)
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY, -- QBD Invoice ID
    customer_id UUID REFERENCES auth.users(id),
    qbd_customer_id TEXT, -- The name or ID in QBD for cross-referencing
    invoice_number TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    balance NUMERIC NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'open', -- open, paid, overdue, partially_paid
    due_date DATE,
    payment_url TEXT, -- The Intuit Payment Link
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can only see their own invoices" 
    ON invoices FOR SELECT 
    USING (auth.uid() = customer_id);

-- 3. Invoice Line Items (For "Bottle by Bottle" Sales History)
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id),
    product_name TEXT NOT NULL,
    sku TEXT,
    qty INTEGER NOT NULL DEFAULT 0,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    total_price NUMERIC GENERATED ALWAYS AS (qty * unit_price) STORED,
    invoice_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can only see their own sales history" 
    ON invoice_items FOR SELECT 
    USING (auth.uid() = customer_id);

-- 4. Portal Generated Orders
CREATE TABLE IF NOT EXISTS portal_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'processing',
    total NUMERIC NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portal_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can only see their own portal orders" 
    ON portal_orders FOR SELECT 
    USING (auth.uid() = customer_id);
CREATE POLICY "Customers can create their own orders" 
    ON portal_orders FOR INSERT 
    WITH CHECK (auth.uid() = customer_id);

-- 5. Portal Order Items
CREATE TABLE IF NOT EXISTS portal_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES portal_orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id),
    product_id UUID NOT NULL, -- Link to products table
    product_name TEXT,
    qty INTEGER NOT NULL DEFAULT 0,
    price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portal_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can only see their own portal order items" 
    ON portal_order_items FOR SELECT 
    USING (auth.uid() = customer_id);
CREATE POLICY "Customers can create their own portal order items" 
    ON portal_order_items FOR INSERT 
    WITH CHECK (auth.uid() = customer_id);

-- 6. Payment History
CREATE TABLE IF NOT EXISTS payment_history (
    id TEXT PRIMARY KEY, -- QBD or Stripe Payment ID
    customer_id UUID REFERENCES auth.users(id),
    amount NUMERIC NOT NULL,
    method TEXT,
    payment_date DATE,
    memo TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can only see their own payments" 
    ON payment_history FOR SELECT 
    USING (auth.uid() = customer_id);

-- Ensure service_role can do everything (for sync agent and admin panel)
CREATE POLICY "Service role full access invoices" ON invoices FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access invoice_items" ON invoice_items FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access portal_orders" ON portal_orders FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access portal_order_items" ON portal_order_items FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access payment_history" ON payment_history FOR ALL TO service_role USING (true);
