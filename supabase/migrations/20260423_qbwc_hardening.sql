-- Migration: QBWC Sync Hardening
-- Adds fields for QuickBooks Desktop ListID mapping and sync state

-- 1. Updates for Customers
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS qbd_listid TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS qbd_editsequence TEXT,
ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMPTZ;

-- 2. Updates for Invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS qbd_editsequence TEXT,
ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMPTZ;

-- 3. Create Sync Logs / Status table
CREATE TABLE IF NOT EXISTS sync_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_check_in TIMESTAMPTZ DEFAULT now(),
    status TEXT, -- 'success', 'error', 'running'
    message TEXT,
    sync_type TEXT -- 'invoices', 'customers', 'full'
);

-- 4. Enable RLS for sync_status (Admin only)
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access sync_status" ON sync_status FOR ALL TO service_role USING (true);
