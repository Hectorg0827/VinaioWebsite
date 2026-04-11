-- Migration: Backend Hardening (RLS & Policies)

-- ─── Site Team ──────────────────────────────────────────────────────────────
ALTER TABLE IF EXISTS site_team ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_team' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON site_team FOR SELECT TO public USING (active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_team' AND policyname = 'Admin Full Access') THEN
        CREATE POLICY "Admin Full Access" ON site_team FOR ALL TO service_role USING (true);
    END IF;
END $$;

-- ─── Customers Hardening ─────────────────────────────────────────────────────
-- Ensure status is only modifiable by admin (service_role)
-- The existing policy for SELECT is fine. 
-- We don't have an UPDATE policy for public/authenticated, so it's already safe.

-- ─── Verify Site Management Tables ──────────────────────────────────────────
ALTER TABLE IF EXISTS site_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_catalogs ENABLE ROW LEVEL SECURITY;

-- These should already have public read policies from seed.sql, 
-- but we'll ensure service_role has full access for the Admin Panel.

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_hero' AND policyname = 'Admin Full Access') THEN
        CREATE POLICY "Admin Full Access" ON site_hero FOR ALL TO service_role USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_partners' AND policyname = 'Admin Full Access') THEN
        CREATE POLICY "Admin Full Access" ON site_partners FOR ALL TO service_role USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_catalogs' AND policyname = 'Admin Full Access') THEN
        CREATE POLICY "Admin Full Access" ON site_catalogs FOR ALL TO service_role USING (true);
    END IF;
END $$;
