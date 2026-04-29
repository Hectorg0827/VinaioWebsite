-- ─── Vinaio: site_partners Table Migration ────────────────────────────────
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yzcmfepqjdybavpsjbwm/sql/new

CREATE TABLE IF NOT EXISTS public.site_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_partners ENABLE ROW LEVEL SECURITY;

-- Public read policy (for the landing page marquee)
CREATE POLICY "site_partners_public_read" ON public.site_partners
  FOR SELECT USING (active = true);

-- Service role full access (for admin panel CRUD)
CREATE POLICY "service_role_all_site_partners" ON public.site_partners
  FOR ALL USING (true);

-- ─── Seed with existing brand logos ──────────────────────────────────────────
INSERT INTO site_partners (name, logo_url, active, "order") VALUES
  ('Brand 1',  '/logos/brand-1.png',  true, 1),
  ('Brand 2',  '/logos/brand-2.jpg',  true, 2),
  ('Brand 3',  '/logos/brand-3.svg',  true, 3),
  ('Brand 4',  '/logos/brand-4.png',  true, 4),
  ('Brand 5',  '/logos/brand-5.png',  true, 5),
  ('Brand 6',  '/logos/brand-6.png',  true, 6),
  ('Brand 7',  '/logos/brand-7.png',  true, 7),
  ('Brand 8',  '/logos/brand-8.png',  true, 8),
  ('Brand 9',  '/logos/brand-9.png',  true, 9),
  ('Brand 10', '/logos/brand-10.png', true, 10),
  ('Brand 11', '/logos/brand-11.png', true, 11),
  ('Brand 12', '/logos/brand-12.svg', true, 12),
  ('Brand 13', '/logos/brand-13.png', true, 13),
  ('Brand 14', '/logos/brand-14.png', true, 14),
  ('Brand 15', '/logos/brand-15.png', true, 15),
  ('Brand 16', '/logos/brand-16.png', true, 16),
  ('Brand 17', '/logos/brand-17.png', true, 17),
  ('Brand 18', '/logos/brand-18.png', true, 18),
  ('Brand 19', '/logos/brand-19.png', true, 19),
  ('Brand 20', '/logos/brand-20.png', true, 20),
  ('Brand 21', '/logos/brand-21.png', true, 21),
  ('Brand 22', '/logos/brand-22.png', true, 22),
  ('Brand 23', '/logos/brand-23.png', true, 23),
  ('Brand 24', '/logos/brand-24.svg', true, 24),
  ('Brand 25', '/logos/brand-25.png', true, 25),
  ('Brand 26', '/logos/brand-26.png', true, 26),
  ('Brand 27', '/logos/brand-27.png', true, 27),
  ('Brand 28', '/logos/brand-28.jpg', true, 28),
  ('Brand 29', '/logos/brand-29.png', true, 29),
  ('Brand 30', '/logos/brand-30.png', true, 30),
  ('Brand 31', '/logos/brand-31.jpg', true, 31),
  ('Brand 32', '/logos/brand-32.png', true, 32),
  ('Brand 33', '/logos/brand-33.png', true, 33),
  ('Brand 34', '/logos/brand-34.jpg', true, 34),
  ('Brand 35', '/logos/brand-35.png', true, 35),
  ('Brand 36', '/logos/brand-36.png', true, 36),
  ('Brand 37', '/logos/brand-37.png', true, 37),
  ('Brand 38', '/logos/brand-38.png', true, 38),
  ('Brand 39', '/logos/brand-39.png', true, 39),
  ('Brand 40', '/logos/brand-40.png', true, 40),
  ('Brand 41', '/logos/brand-41.png', true, 41),
  ('Brand 42', '/logos/brand-42.png', true, 42),
  ('Brand 43', '/logos/brand-43.png', true, 43),
  ('Brand 44', '/logos/brand-44.png', true, 44),
  ('Brand 45', '/logos/brand-45.png', true, 45),
  ('Brand 46', '/logos/brand-46.png', true, 46),
  ('Brand 47', '/logos/brand-47.png', true, 47),
  ('Brand 48', '/logos/brand-48.webp', true, 48),
  ('Brand 49', '/logos/brand-49.png', true, 49),
  ('Brand 50', '/logos/brand-50.svg', true, 50),
  ('Brand 51', '/logos/brand-51.jpg', true, 51),
  ('Brand 52', '/logos/brand-52.jpg', true, 52),
  ('Brand 53', '/logos/brand-53.png', true, 53),
  ('Brand 54', '/logos/brand-54.png', true, 54),
  ('Brand 55', '/logos/brand-55.png', true, 55),
  ('Brand 56', '/logos/brand-56.png', true, 56),
  ('Brand 57', '/logos/brand-57.png', true, 57),
  ('Brand 58', '/logos/brand-58.png', true, 58),
  ('Brand 59', '/logos/brand-59.svg', true, 59),
  ('Brand 60', '/logos/brand-60.png', true, 60),
  ('Brand 61', '/logos/brand-61.svg', true, 61),
  ('Brand 62', '/logos/brand-62.png', true, 62),
  ('Brand 63', '/logos/brand-63.png', true, 63),
  ('Brand 64', '/logos/brand-64.png', true, 64),
  ('Brand 65', '/logos/brand-65.png', true, 65),
  ('Brand 66', '/logos/brand-66.png', true, 66),
  ('Brand 67', '/logos/brand-67.jpg', true, 67),
  ('Brand 68', '/logos/brand-68.jpg', true, 68),
  ('Brand 69', '/logos/brand-69.png', true, 69),
  ('Brand 70', '/logos/brand-70.png', true, 70),
  ('Brand 71', '/logos/brand-71.png', true, 71),
  ('Brand 72', '/logos/brand-72.jpg', true, 72),
  ('Brand 73', '/logos/brand-73.svg', true, 73),
  ('Brand 74', '/logos/brand-74.png', true, 74),
  ('Brand 75', '/logos/brand-75.png', true, 75),
  ('Brand 76', '/logos/brand-76.png', true, 76),
  ('Brand 77', '/logos/brand-77.png', true, 77),
  ('Brand 78', '/logos/brand-78.png', true, 78),
  ('Brand 79', '/logos/brand-79.jpg', true, 79),
  ('Brand 80', '/logos/brand-80.png', true, 80),
  ('Brand 81', '/logos/brand-81.jpg', true, 81),
  ('Brand 82', '/logos/brand-82.png', true, 82),
  ('Brand 83', '/logos/brand-83.png', true, 83),
  ('Brand 84', '/logos/brand-84.jpg', true, 84)
ON CONFLICT DO NOTHING;
