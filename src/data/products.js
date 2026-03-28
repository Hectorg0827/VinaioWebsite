// ─── Vinaio Imports — Product Catalog ────────────────────────────────────────
//
// HOW TO UPDATE:
//   • To add a product, copy an existing entry, change the values, and add it
//     to the PRODUCTS array below.
//   • If Supabase is configured, edit via the Supabase Table Editor dashboard —
//     changes appear on the site instantly without any code deploy.
//   • This file is used as fallback / seed data if Supabase is unavailable.
//
// FIELDS:
//   id          — unique slug (used as URL/key)
//   name        — display name
//   sku         — internal SKU code
//   price       — wholesale unit price (USD)
//   unit        — bottle/can size (e.g. "750ml")
//   category    — one of: Wine | Rum | Beer | Spirits
//   origin      — country of origin
//   region      — broader region (Caribbean | South America | Europe)
//   inStock     — true/false
//   featured    — show in "Featured Products" section on Portfolio page
//   description — 1–2 sentence tasting/product note for public catalog
//   tags        — array of searchable tags
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCTS = [
  {
    id: "bermudez",
    name: "Bermúdez Ron Añejo",
    sku: "BRM-750",
    price: 18.99,
    unit: "750ml",
    category: "Rum",
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: true,
    featured: true,
    description:
      "Aged in American oak barrels, Bermúdez Ron Añejo delivers smooth notes of vanilla, dried fruit, and a warm oak finish. A cornerstone of Dominican rum heritage since 1852.",
    tags: ["aged", "premium", "cocktail", "dominican"],
  },
  {
    id: "candela",
    name: "Candela Mamajuana",
    sku: "CDL-750",
    price: 22.50,
    unit: "750ml",
    category: "Spirits",
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: true,
    featured: false,
    description:
      "An authentic Dominican herbal spirit infused with roots, bark, and spices in a rum-wine base. Bold, complex, and deeply rooted in Caribbean tradition.",
    tags: ["herbal", "traditional", "dominican", "mamajuana"],
  },
  {
    id: "latuya",
    name: "Cerveza República La Tuya",
    sku: "CRT-355",
    price: 2.49,
    unit: "355ml",
    category: "Beer",
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: true,
    featured: false,
    description:
      "A crisp, light lager brewed with Caribbean water and premium malt. Clean finish with subtle citrus notes — the everyday beer of the Dominican Republic.",
    tags: ["lager", "light", "dominican", "crisp"],
  },
  {
    id: "maldita",
    name: "Maldita Suegra",
    sku: "MLS-750",
    price: 16.99,
    unit: "750ml",
    category: "Spirits",
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: false,
    featured: false,
    description:
      "A playfully named Dominican spirit blending tropical fruit notes with a medium-bodied sweetness. A crowd-pleasing pour with cultural character.",
    tags: ["sweet", "tropical", "dominican"],
  },
  {
    id: "dulce",
    name: "Dulce Pasitos",
    sku: "DLP-750",
    price: 9.99,
    unit: "750ml",
    category: "Wine",
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: true,
    featured: false,
    description:
      "A semi-sweet Dominican wine with bright tropical fruit aromas and a smooth, approachable finish. Perfect for celebrations and casual occasions.",
    tags: ["semi-sweet", "tropical", "dominican", "approachable"],
  },
  {
    id: "vinicola",
    name: "Vinícola del Norte Reserva",
    sku: "VDN-750",
    price: 14.50,
    unit: "750ml",
    category: "Wine",
    origin: "Dominican Republic",
    region: "Caribbean",
    inStock: true,
    featured: false,
    description:
      "A structured reserve-level Dominican red with dark berry fruit, balanced tannins, and a lingering finish. Crafted for the growing Caribbean fine wine market.",
    tags: ["reserva", "red wine", "dominican", "structured"],
  },
  {
    id: "maipo",
    name: "Viña Maipo Cabernet Sauvignon",
    sku: "VMP-750",
    price: 11.99,
    unit: "750ml",
    category: "Wine",
    origin: "Chile",
    region: "South America",
    inStock: true,
    featured: true,
    description:
      "From Chile's iconic Maipo Valley, this Cabernet Sauvignon shows classic blackcurrant and cedar notes with firm but approachable tannins. Excellent QPR.",
    tags: ["cabernet", "chile", "maipo valley", "red wine"],
  },
  {
    id: "borgo",
    name: "Borgo Antico Sangiovese",
    sku: "BGA-750",
    price: 13.99,
    unit: "750ml",
    category: "Wine",
    origin: "Italy",
    region: "Europe",
    inStock: true,
    featured: false,
    description:
      "A bright, food-friendly Italian Sangiovese with red cherry, dried herb, and earthy minerality. True to its Tuscan roots with a pleasing acidity.",
    tags: ["sangiovese", "italy", "tuscany", "red wine", "food-friendly"],
  },
  {
    id: "fuerza",
    name: "Vino La Fuerza Garnacha",
    sku: "VLF-750",
    price: 12.50,
    unit: "750ml",
    category: "Wine",
    origin: "Spain",
    region: "Europe",
    inStock: true,
    featured: true,
    description:
      "A vibrant Spanish Garnacha bursting with ripe red berry, spice, and a hint of floral violet. Reflects the character of old-vine Aragonese terroir with elegance.",
    tags: ["garnacha", "spain", "aragon", "red wine", "old vine"],
  },
  {
    id: "mack",
    name: "Mack Albert Premium Whisky",
    sku: "MAW-750",
    price: 34.99,
    unit: "750ml",
    category: "Spirits",
    origin: "Europe",
    region: "Europe",
    inStock: true,
    featured: true,
    description:
      "A sophisticated European blended whisky with honeyed malt, vanilla cream, and a long warming finish. Crafted for the discerning on-premise and retail market.",
    tags: ["whisky", "blended", "europe", "premium", "on-premise"],
  },
];

// ─── Category list (derived — do not edit manually) ──────────────────────────
export const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

// ─── Origin regions ───────────────────────────────────────────────────────────
export const ORIGINS = [
  {
    name: "Dominican Republic",
    description:
      "The heart of Vinaio's Caribbean portfolio. From aged rums to vibrant lagers, Dominican producers represent the soul of our founding catalog.",
    flag: "🇩🇴",
  },
  {
    name: "Chile",
    description:
      "World-class value from the Maipo and Central Valleys. Chilean expressions offer premium quality at accessible price points.",
    flag: "🇨🇱",
  },
  {
    name: "Spain",
    description:
      "Old-vine Garnacha and structured reds from Iberia's iconic appellations — the cornerstone of our European expansion.",
    flag: "🇪🇸",
  },
  {
    name: "Italy",
    description:
      "Bright, food-friendly Italian varietals sourced from artisan producers across Tuscany and beyond.",
    flag: "🇮🇹",
  },
  {
    name: "Europe",
    description:
      "Premium spirits and wines sourced from across the European continent for the discerning US on-premise and retail market.",
    flag: "🇪🇺",
  },
];
