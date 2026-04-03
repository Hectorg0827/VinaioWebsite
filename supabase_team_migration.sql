-- SQL Migration: Create site_team table
CREATE TABLE IF NOT EXISTS site_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  desc TEXT,
  level TEXT DEFAULT 'sales', -- executive, leadership, sales, advisor
  photo_url TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_team ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read
CREATE POLICY "Public Read Access" 
ON site_team FOR SELECT 
TO public 
USING (true);

-- Policy: Service Role Access
CREATE POLICY "Admin Full Access"
ON site_team FOR ALL
TO service_role
USING (true);
