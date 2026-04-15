-- Migration: Products RLS Hardening

ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Public can read all products (needed for portfolio page)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public Read Products') THEN
        CREATE POLICY "Public Read Products" ON products FOR SELECT TO public USING (true);
    END IF;

    -- Only service_role (Admin API) can insert, update, or delete products
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin Full Access Products') THEN
        CREATE POLICY "Admin Full Access Products" ON products FOR ALL TO service_role USING (true);
    END IF;
END $$;
