-- ─── Vinaio Imports — Supabase Schema & Seed Data ──────────────────────────
-- Run this in your Supabase SQL Editor to set up the database.
-- Go to: Supabase Dashboard → SQL Editor → New Query → paste & run.

-- ─── Products ────────────────────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  sku          text,
  price        numeric(10,2),
  unit         text,
  category     text,
  origin       text,
  region       text,
  in_stock     boolean default true,
  featured     boolean default false,
  description  text,
  tags         text[],
  image_url    text,
  created_at   timestamptz default now()
);

-- ─── Customer profiles (linked to auth.users) ────────────────────────────────
create table if not exists customers (
  id             uuid primary key references auth.users on delete cascade,
  company        text,
  account_number text unique,
  credit_terms   text default 'Net 30',
  credit_limit   numeric(12,2) default 25000,
  balance        numeric(12,2) default 0,
  rep_name       text,
  rep_phone      text,
  rep_email      text,
  created_at     timestamptz default now()
);

-- ─── Orders ──────────────────────────────────────────────────────────────────
create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references customers on delete cascade,
  status      text default 'processing',
  total       numeric(12,2),
  tracking    text,
  created_at  timestamptz default now()
);

-- ─── Order Items ─────────────────────────────────────────────────────────────
create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid references orders on delete cascade,
  product_id uuid references products on delete set null,
  qty        int,
  unit_price numeric(10,2)
);

-- ─── Invoices ────────────────────────────────────────────────────────────────
create table if not exists invoices (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references customers on delete cascade,
  order_id    uuid references orders on delete set null,
  amount      numeric(12,2),
  paid        numeric(12,2) default 0,
  due_date    date,
  status      text default 'open',
  created_at  timestamptz default now()
);

-- ─── Licenses & Contracts ────────────────────────────────────────────────────
create table if not exists licenses (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references customers on delete cascade,
  type        text,
  state       text,
  number      text,
  expiry      date,
  status      text default 'active'
);

-- ─── Contact Submissions ─────────────────────────────────────────────────────
create table if not exists contact_submissions (
  id             uuid primary key default gen_random_uuid(),
  name           text,
  company        text,
  license_number text,
  email          text,
  phone          text,
  inquiry_type   text,
  message        text,
  created_at     timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table invoices enable row level security;
alter table licenses enable row level security;
alter table contact_submissions enable row level security;

-- Products: public read
create policy "products_public_read" on products for select using (true);

-- Customers: own row only
create policy "customers_own" on customers for all using (auth.uid() = id);

-- Orders: own orders only
create policy "orders_own" on orders for all using (
  auth.uid() = customer_id
);

-- Order items: via order ownership
create policy "order_items_own" on order_items for all using (
  exists (select 1 from orders where orders.id = order_id and orders.customer_id = auth.uid())
);

-- Invoices: own invoices only
create policy "invoices_own" on invoices for all using (auth.uid() = customer_id);

-- Licenses: own licenses only
create policy "licenses_own" on licenses for all using (auth.uid() = customer_id);

-- Contact: insert only (anonymous)
create policy "contact_insert" on contact_submissions for insert with check (true);

-- ─── Seed: Products ───────────────────────────────────────────────────────────
insert into products (slug, name, sku, price, unit, category, origin, region, in_stock, featured, description, tags) values
('bermudez',  'Bermúdez Ron Añejo',             'BRM-750', 18.99, '750ml', 'Rum',     'Dominican Republic', 'Caribbean',     true,  true,  'Aged in American oak barrels, Bermúdez Ron Añejo delivers smooth notes of vanilla, dried fruit, and a warm oak finish. A cornerstone of Dominican rum heritage since 1852.', array['aged','premium','cocktail','dominican']),
('candela',   'Candela Mamajuana',              'CDL-750', 22.50, '750ml', 'Spirits', 'Dominican Republic', 'Caribbean',     true,  false, 'An authentic Dominican herbal spirit infused with roots, bark, and spices in a rum-wine base. Bold, complex, and deeply rooted in Caribbean tradition.', array['herbal','traditional','dominican','mamajuana']),
('latuya',    'Cerveza República La Tuya',      'CRT-355',  2.49, '355ml', 'Beer',    'Dominican Republic', 'Caribbean',     true,  false, 'A crisp, light lager brewed with Caribbean water and premium malt. Clean finish with subtle citrus notes — the everyday beer of the Dominican Republic.', array['lager','light','dominican','crisp']),
('maldita',   'Maldita Suegra',                 'MLS-750', 16.99, '750ml', 'Spirits', 'Dominican Republic', 'Caribbean',     false, false, 'A playfully named Dominican spirit blending tropical fruit notes with a medium-bodied sweetness. A crowd-pleasing pour with cultural character.', array['sweet','tropical','dominican']),
('dulce',     'Dulce Pasitos',                  'DLP-750',  9.99, '750ml', 'Wine',    'Dominican Republic', 'Caribbean',     true,  false, 'A semi-sweet Dominican wine with bright tropical fruit aromas and a smooth, approachable finish.', array['semi-sweet','tropical','dominican','approachable']),
('vinicola',  'Vinícola del Norte Reserva',     'VDN-750', 14.50, '750ml', 'Wine',    'Dominican Republic', 'Caribbean',     true,  false, 'A structured reserve-level Dominican red with dark berry fruit, balanced tannins, and a lingering finish.', array['reserva','red wine','dominican','structured']),
('maipo',     'Viña Maipo Cabernet Sauvignon',  'VMP-750', 11.99, '750ml', 'Wine',    'Chile',              'South America', true,  true,  'From Chile''s iconic Maipo Valley, this Cabernet Sauvignon shows classic blackcurrant and cedar notes with firm but approachable tannins.', array['cabernet','chile','maipo valley','red wine']),
('borgo',     'Borgo Antico Sangiovese',         'BGA-750', 13.99, '750ml', 'Wine',    'Italy',              'Europe',        true,  false, 'A bright, food-friendly Italian Sangiovese with red cherry, dried herb, and earthy minerality.', array['sangiovese','italy','tuscany','red wine','food-friendly']),
('fuerza',    'Vino La Fuerza Garnacha',         'VLF-750', 12.50, '750ml', 'Wine',    'Spain',              'Europe',        true,  true,  'A vibrant Spanish Garnacha bursting with ripe red berry, spice, and a hint of floral violet.', array['garnacha','spain','aragon','red wine','old vine']),
('mack',      'Mack Albert Premium Whisky',      'MAW-750', 34.99, '750ml', 'Spirits', 'Europe',             'Europe',        true,  true,  'A sophisticated European blended whisky with honeyed malt, vanilla cream, and a long warming finish.', array['whisky','blended','europe','premium','on-premise'])
on conflict (slug) do nothing;
