const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const dotenv = require("dotenv");

// Load env
const env = dotenv.parse(fs.readFileSync(".env.local"));
const supabase = createClient("https://yzcmfepqjdybavpsjbwm.supabase.co", env.SUPABASE_SERVICE_ROLE_KEY);

async function fixEncoding() {
  console.log("Fetching products...");
  const { data: products, error } = await supabase.from("products").select("id, name, image_url");
  
  if (error) {
    console.error("Supabase Error:", error);
    return;
  }

  console.log(`Analyzing ${products.length} products...`);
  
  const toUpdate = [];
  
  for (const p of products) {
    if (!p.image_url) continue;

    try {
      // 1. Decode potential URL encoding
      const decoded = decodeURI(p.image_url);
      
      // 2. Normalize to NFC (Canonical Composition)
      const normalized = decoded.normalize("NFC");
      
      // 3. Construct clean URL (preserving slashes)
      const parts = normalized.split("/");
      const reEncoded = parts.map((part, i) => i < 3 ? part : encodeURIComponent(part)).join("/");
      
      // Check if it changed or if the format was improved
      if (reEncoded !== p.image_url) {
        console.log(`Fixing URL for: ${p.name}`);
        console.log(`  OLD: ${p.image_url}`);
        console.log(`  NEW: ${reEncoded}`);
        toUpdate.push({ id: p.id, image_url: reEncoded });
      }
    } catch (e) {
      console.warn(`Skipping invalid URL for ${p.id}: ${p.image_url}`);
    }
  }

  if (toUpdate.length === 0) {
    console.log("No encoding issues found.");
  } else {
    console.log(`Applying ${toUpdate.length} updates...`);
    for (const item of toUpdate) {
      const { error: upError } = await supabase
        .from("products")
        .update({ image_url: item.image_url })
        .eq("id", item.id);
      
      if (upError) console.error(`Error updating ${item.id}:`, upError.message);
    }
    console.log("Updates applied successfully.");
  }
}

fixEncoding();
