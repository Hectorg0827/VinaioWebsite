-- ─── Vinaio: site_admins Table Migration ────────────────────────────────
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yzcmfepqjdybavpsjbwm/sql/new

CREATE TABLE IF NOT EXISTS public.site_admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;

-- Only service role can do everything (used by our API routes)
DROP POLICY IF EXISTS "service_role_all_site_admins" ON public.site_admins;
CREATE POLICY "service_role_all_site_admins" ON public.site_admins
  FOR ALL USING (true);
