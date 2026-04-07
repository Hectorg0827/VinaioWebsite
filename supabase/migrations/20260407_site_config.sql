-- SQL Migration: Create site_config table for global site settings
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- 'branding', 'contact', etc.
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Branding config
INSERT INTO site_config (key, value)
VALUES ('branding', '{"logo_url": "/logo.png"}')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read
CREATE POLICY "Public Read Access" 
ON site_config FOR SELECT 
TO public 
USING (true);

-- Policy: Service Role Access
CREATE POLICY "Admin Full Access"
ON site_config FOR ALL
TO service_role
USING (true);
