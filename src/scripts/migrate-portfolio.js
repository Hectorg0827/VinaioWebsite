const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey || serviceKey === "YOUR_SERVICE_ROLE_KEY_HERE") {
  console.error("❌ ERROR: Missing Supabase Credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// ─── Configuration ───────────────────────────────────────────────────────────
const DATA_PATH = path.join(process.cwd(), "assets/data/products.json");
const IMAGES_ROOT = path.join(process.cwd(), "assets/images");
const BUCKET_NAME = "products";

// ─── Category Healing Logic ──────────────────────────────────────────────────
const CATEGORY_MAP = {
  "WINE":   ["WINE", "ROSSO", "BIANCO", "IGP", "DOP", "CHARDONNAY", "CABERNET", "MERLOT", "PROSECCO", "LEUCI", "MONTE TONDO", "ALJIBES", "ALTOS DE TORONA", "INURRIETA", "VALDUERO"],
  "RUM":    ["RUM", "RON", "BERMUDEZ", "MACORIX", "PUNTACANA", "KHUKRI", "BRUGAL"],
  "BEER":   ["BEER", "LAGER", "ALE", "STOUT", "PILSNER", "MICA", "TORO", "BARAHSINGHE", "REPUBLICA"],
  "SPIRITS": ["SPIRITS", "VODKA", "GIN", "LIQUOR", "WHISKY", "BRANDY", "MAMAJUANA", "CANDELA", "8848"],
};

function healCategory(item) {
  const text = `${item.brand} ${item.name} ${item.type}`.toUpperCase();
  
  if (CATEGORY_MAP.RUM.some(k => text.includes(k))) return "Rum";
  if (CATEGORY_MAP.WINE.some(k => text.includes(k))) return "Wine";
  if (CATEGORY_MAP.BEER.some(k => text.includes(k))) return "Beer";
  if (CATEGORY_MAP.SPIRITS.some(k => text.includes(k))) return "Spirits";
  
  return item.category || "Other";
}

// ─── Utils ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// ─── Migration Main ──────────────────────────────────────────────────────────
async function migrate() {
  console.log("🚀 Starting Vinaio Portfolio Migration...");

  // 1. Ensure Bucket Exists
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET_NAME)) {
    console.log(`📦 Creating missing storage bucket: ${BUCKET_NAME}...`);
    const { error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    });
    if (bucketError) {
      console.error(`❌ Failed to create bucket: ${bucketError.message}`);
      // If we can't create it, we'll probably fail uploads, so we proceed and let those errors show
    }
  }

  // 2. Read products
  const rawData = fs.readFileSync(DATA_PATH, "utf8");
  const products = JSON.parse(rawData);
  console.log(`📦 Found ${products.length} products to import.`);

  const stats = { success: 0, failed: 0, images: 0 };

  for (const [index, p] of products.entries()) {
    try {
      const slug = `${slugify(p.brand || "unknown")}-${slugify(p.name)}-${p.id}`;
      const category = healCategory(p);
      
      let imageUrl = null;

      // 3. Handle Image Upload
      if (p.image_file && p.image_file !== "placeholder.png") {
        const localPath = path.join(IMAGES_ROOT, p.image_file);
        if (fs.existsSync(localPath)) {
          const fileContent = fs.readFileSync(localPath);
          const ext = path.extname(p.image_file).toLowerCase();
          const fileName = `${slug}${ext}`;
          
          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileContent, {
              contentType: ext === '.png' ? 'image/png' : 'image/jpeg',
              upsert: true
            });

          if (!error) {
            const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
            imageUrl = publicUrl;
            stats.images++;
          } else {
            console.warn(`⚠️ Failed to upload image for ${p.name}: ${error.message}`);
          }
        }
      }

      // 4. Transform Tier Pricing
      const tierPricing = [];
      if (p.tier1_min_cs) tierPricing.push({ min_cs: p.tier1_min_cs, case_price: p.tier1_case_price, bottle_price: p.tier1_bottle_price });
      if (p.tier2_min_cs) tierPricing.push({ min_cs: p.tier2_min_cs, case_price: p.tier2_case_price, bottle_price: p.tier2_bottle_price });
      if (p.tier3_min_cs) tierPricing.push({ min_cs: p.tier3_min_cs, case_price: p.tier3_case_price, bottle_price: p.tier3_bottle_price });

      // 5. Determine Portfolios
      const portfolios = ["all"];
      if (p.origin?.toLowerCase().includes("dominican") || p.origin?.toLowerCase().includes("dr")) portfolios.push("caribbean");
      if (category === "Beer") portfolios.push("beer_low_alc");
      if (p.brand?.toLowerCase().includes("bermudez") || p.brand?.toLowerCase().includes("macorix")) portfolios.push("caribbean");

      // 6. Database Upsert
      const { error: dbError } = await supabase
        .from("products")
        .upsert([{
          slug,
          product_code:   p.product_code || p.id,
          brand:          p.brand,
          name:           p.name,
          vintage:        p.vintage,
          format:         p.format,
          type:           p.type,
          category:       category,
          categories:     [category],
          description_en: p.description_en,
          description_es: p.description_es,
          price_case:     p.base_price_case,
          price_bottle:   p.base_price_bottle,
          tier_pricing:   tierPricing,
          image_url:      imageUrl,
          portfolios:     portfolios,
          in_stock:       true,
        }], { onConflict: 'slug' });

      if (dbError) {
        console.error(`❌ Failed to insert product ${p.name}:`, dbError.message);
        stats.failed++;
      } else {
        stats.success++;
      }

      if ((index + 1) % 10 === 0) console.log(`✓ Processed ${index + 1}/${products.length}...`);

    } catch (err) {
      console.error(`💥 Fatal error on item ${index}:`, err);
      stats.failed++;
    }
  }

  console.log("\n✨ Migration Complete!");
  console.log(`✅ Products Created: ${stats.success}`);
  console.log(`🖼️ Images Uploaded:  ${stats.images}`);
  console.log(`❌ Failures:         ${stats.failed}`);
}

migrate();
