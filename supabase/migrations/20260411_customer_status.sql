-- Migration: Add status to customers for manual approval flow
ALTER TABLE customers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Update existing customers to 'active' (assuming they were already vetted)
UPDATE customers SET status = 'active' WHERE status IS NULL OR status = 'pending';

-- Add status check if needed for RLS, but primarily for application logic.
