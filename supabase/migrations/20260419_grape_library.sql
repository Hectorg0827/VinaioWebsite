-- ─── Wine Regions ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wine_regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  description TEXT,
  climate TEXT,
  terroir TEXT,
  map_id TEXT -- Linked to SVG path ID
);

-- ─── Grapes ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grapes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT CHECK (color IN ('Red', 'White', 'Rosé', 'Sparkling')),
  body TEXT,
  acidity TEXT,
  profile JSONB, -- { fruit: string, earth: string, oak: string, acid: level, tannin: level }
  description TEXT,
  food_pairings TEXT[],
  tech_sheet JSONB, -- { bud_break: string, soil_pref: string, climate_pref: string }
  is_featured BOOLEAN DEFAULT false,
  is_local_gem BOOLEAN DEFAULT false,
  vinaio_wine_fallback TEXT -- Fallback mention if no product matching
);

-- ─── Grape-Region Join ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grape_regions (
  grape_id TEXT REFERENCES grapes(id) ON DELETE CASCADE,
  region_id TEXT REFERENCES wine_regions(id) ON DELETE CASCADE,
  PRIMARY KEY (grape_id, region_id)
);

-- ─── Product Expansion ───────────────────────────────────────────────────────
-- Add grapes association to products
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'grape_ids') THEN
    ALTER TABLE products ADD COLUMN grape_ids TEXT[];
  END IF;
END $$;

-- ─── RLS Policies ────────────────────────────────────────────────────────────
ALTER TABLE wine_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grape_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Regions" ON wine_regions FOR SELECT TO public USING (true);
CREATE POLICY "Public Read Grapes" ON grapes FOR SELECT TO public USING (true);
CREATE POLICY "Public Read Grape Regions" ON grape_regions FOR SELECT TO public USING (true);

-- ─── Initial Seed Data ───────────────────────────────────────────────────────
INSERT INTO wine_regions (id, name, country_code, description) VALUES
('ribera-del-duero', 'Ribera del Duero', 'es', 'High-altitude plateau with extreme temperature swings.'),
('rias-baixas', 'Rías Baixas', 'es', 'Cool, Atlantic-influenced maritime climate.'),
('la-mancha', 'La Mancha', 'es', 'The vast central plateau of Spain.'),
('stellenbosch', 'Stellenbosch', 'za', 'South Africa’s premier wine region with diverse microclimates.'),
('mendoza', 'Mendoza', 'ar', 'High-altitude Andean foothills.'),
('tuscany', 'Tuscany', 'it', 'Rolling hills of central Italy, home to Sangiovese.'),
('rueda', 'Rueda', 'es', 'High-altitude gravelly soils, the heart of Verdejo.');

INSERT INTO grapes (id, name, color, body, acidity, profile, description, food_pairings, tech_sheet, is_featured) VALUES
('tempranillo', 'Tempranillo', 'Red', 'Medium–Full', 'Medium', '{"fruit": "Cherry", "earth": "Leather", "oak": "Vanilla", "other": "Tobacco"}', 'Spain’s noble grape, known for longevity and structure.', ARRAY['Grilled lamb', 'Aged cheeses'], '{"soil": "Chalky-clay", "climate": "Continental"}', true),
('albarino', 'Albariño', 'White', 'Light–Medium', 'High', '{"fruit": "Peach", "earth": "Saline", "oak": "None", "other": "Citrus"}', 'Crisp, aromatic white from the Atlantic coast.', ARRAY['Oysters', 'Grilled fish'], '{"soil": "Granite", "climate": "Maritime"}', true),
('cabernet-sauvignon', 'Cabernet Sauvignon', 'Red', 'Full', 'Medium–High', '{"fruit": "Blackcurrant", "earth": "Graphite", "oak": "Cedar", "other": "Bell pepper"}', 'The global king of reds, structured and powerful.', ARRAY['Ribeye steak', 'Dark chocolate'], '{"soil": "Gravel", "climate": "Warm"}', true),
('garnacha', 'Garnacha', 'Red', 'Medium–Full', 'Medium', '{"fruit": "Raspberry", "earth": "Spice", "oak": "Neutral", "other": "White pepper"}', 'Versatile and plush, the backbone of many Mediterranean blends.', ARRAY['Paella', 'Roasted vegetables'], '{"soil": "Schist", "climate": "Hot"}', true),
('verdejo', 'Verdejo', 'White', 'Light–Medium', 'High', '{"fruit": "Lime", "earth": "Fennel", "oak": "None", "other": "White flowers"}', 'Highly aromatic Spanish white with characteristic bitter finish.', ARRAY['Tapas', 'Goat cheese'], '{"soil": "Gravel", "climate": "Dry"}', true),
('chenin-blanc', 'Chenin Blanc', 'White', 'Medium', 'High', '{"fruit": "Quince", "earth": "Wet stone", "oak": "Honey", "other": "Yellow apple"}', 'Highly versatile grape known for range from bone-dry to sweet.', ARRAY['Thai curry', 'Roasted pork'], '{"soil": "Shale", "climate": "Moderate"}', true);

INSERT INTO grape_regions (grape_id, region_id) VALUES
('tempranillo', 'ribera-del-duero'),
('albarino', 'rias-baixas'),
('garnacha', 'la-mancha'),
('cabernet-sauvignon', 'stellenbosch'),
('verdejo', 'rueda'),
('chenin-blanc', 'stellenbosch');
