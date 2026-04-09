// ─── Vinaio Imports — Product Catalog ────────────────────────────────────────
//
// This file is the fallback/seed data. In production, products are managed
// through the Admin Panel at /admin — no editing of this file is needed.
//
// FIELDS:
//   id          — unique slug (no spaces, e.g. "bermudez-rum")
//   name        — display name shown to customers
//   sku         — internal SKU code
//   price       — wholesale unit price (USD)
//   unit        — bottle/can size (e.g. "750ml", "355ml")
//   categories  — array of categories (a product can belong to more than one)
//                 use any of: Wine | Rum | Beer | Spirits | Whisky | Rosé | Sparkling
//   origin      — country of origin
//   region      — broader region (Caribbean | South America | Europe | North America)
//   inStock     — true = available to order, false = out of stock
//   featured    — true = shown in "Featured Products" section on Portfolio page
//   description — 1–2 sentence tasting/product note for public catalog
//   tags        — extra searchable keywords (optional)
// ─────────────────────────────────────────────────────────────────────────────

const RAW_PRODUCTS = [
  {
    id: "bermudez",
    name: "Ron Añejo",
    brand: "J. Armando Bermúdez",
    type: "Aged Dominican Rum",
    sku: "BRM-750",
    price: 18.99,
    unit: "750ml",
    categories: ["Rum", "Spirits"],
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: true,
    featured: true,
    description:
      "Aged in American oak barrels, Bermúdez Ron Añejo delivers smooth notes of vanilla, dried fruit, and a warm oak finish. A cornerstone of Dominican rum heritage since 1852.",
    tags: ["aged", "premium", "cocktail", "dominican"],
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    logoUrl: "/logo.png"
  },
  {
    id: "candela",
    name: "Mamajuana",
    brand: "Candela",
    type: "Spiced Herbal Spirit",
    sku: "CDL-750",
    price: 22.50,
    unit: "750ml",
    categories: ["Spirits"],
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: true,
    featured: false,
    description:
      "An authentic Dominican herbal spirit infused with roots, bark, and spices in a rum-wine base. Bold, complex, and deeply rooted in Caribbean tradition.",
    tags: ["herbal", "traditional", "dominican", "mamajuana"],
    imageUrl: "https://images.unsplash.com/photo-1569058242253-92a9c71f9867?auto=format&fit=crop&q=80&w=800",
    logoUrl: "/logo.png"
  },
  {
    id: "maipo",
    name: "Cabernet Sauvignon",
    brand: "Viña Maipo",
    type: "Gran Reserva",
    sku: "VMP-750",
    price: 11.99,
    unit: "750ml",
    categories: ["Wine"],
    origin: "Chile",
    region: "South America",
    inStock: true,
    featured: true,
    description:
      "From Chile's iconic Maipo Valley, this Cabernet Sauvignon shows classic blackcurrant and cedar notes with firm but approachable tannins. Excellent QPR.",
    tags: ["cabernet", "chile", "maipo valley", "red wine"],
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800",
    logoUrl: "/logo.png"
  },
];

export const PRODUCTS = RAW_PRODUCTS.map(p => ({
  ...p,
  portfolios: ["all"]
}));

// ─── All available categories ─────────────────────────────────────────────────
// Edit this list to add new category filter options on the Portfolio page.
export const ALL_CATEGORIES = ["Wine", "Spirits", "Rum", "Beer", "Whisky", "Rosé", "Sparkling"];

// Derived list of categories actually used by current products (for filter tabs)
export const ACTIVE_CATEGORIES = [
  "All",
  ...ALL_CATEGORIES.filter((c) =>
    PRODUCTS.some((p) => (p.categories ?? [p.category]).includes(c))
  ),
];

// ─── Origin regions ───────────────────────────────────────────────────────────
export const ORIGINS = [
  {
    name: "Spain",
    description:
      "Old-vine Garnacha and structured reds from Iberia's iconic appellations — the cornerstone of our European expansion.",
    flag: "🇪🇸",
    isoCode: "es"
  },
  {
    name: "Dominican Republic",
    description:
      "The heart of Vinaio's Caribbean portfolio. From aged rums to vibrant lagers, Dominican producers represent the soul of our founding catalog.",
    flag: "🇩🇴",
    isoCode: "do"
  },
  {
    name: "South America",
    description:
      "A rich tapestry of high-altitude Argentinian Malbecs, robust Chilean Reds, and boutique spirits from Colombia and Peru.",
    flag: "🌎",
    isoCode: "ar" // Using Argentina as the primary visual for the South American block
  },
  {
    name: "Europe",
    description:
      "Sourcing global excellence from the world's most renowned regions, from the hills of Tuscany to the cellars of Bordeaux.",
    flag: "🇪🇺",
    isoCode: "eu"
  },
  {
    name: "South African",
    description:
      "Bold, sun-drenched varietals from Stellenbosch and the Western Cape. Quality-driven wines with a focus on sustainable production.",
    flag: "🇿🇦",
    isoCode: "za"
  },
  {
    name: "Italy",
    description:
      "Masterfully balanced varietals from the rolling hills of Tuscany to the crisp peaks of Alto Adige — the essence of Mediterranean heritage.",
    flag: "🇮🇹",
    isoCode: "it"
  },
  {
    name: "France",
    description:
      "Legendary terroir and timeless technique. Our French selections represent the pinnacle of winemaking from Bordeaux to Provence.",
    flag: "🇫🇷",
    isoCode: "fr"
  },
  {
    name: "USA",
    description:
      "Innovative craft spirits and premium domestic wines sourced from the country's most vibrant emerging and established regions.",
    flag: "🇺🇸",
    isoCode: "us"
  },
];
