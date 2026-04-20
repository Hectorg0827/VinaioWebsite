const fs = require('fs');
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

// Load env
const env = dotenv.parse(fs.readFileSync(".env.local"));
const supabase = createClient("https://yzcmfepqjdybavpsjbwm.supabase.co", env.SUPABASE_SERVICE_ROLE_KEY);

const BOTTLE_CDN = "https://vinaio-bottles.b-cdn.net";

// Load local file list
const bunnyFiles = JSON.parse(fs.readFileSync('/tmp/bunny-files.json', 'utf8'));

function normalize(str) {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, "")    // Remove special chars
    .replace(/s$/, "");           // Remove trailing s for basic plural handling (Real vs Reales)
}

async function startMatching() {
  console.log("Fetching products with missing URLs...");
  const { data: products, error } = await supabase.from('products').select('*').is('image_url', null);
  
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Analyzing ${products.length} products against ${bunnyFiles.length} images...`);
  
  const matches = [];

  for (const p of products) {
    const normName = normalize(p.name);
    const normBrand = normalize(p.brand);
    const combined = normBrand + normName;
    
    let bestFile = null;
    let highestScore = 0;

    for (const file of bunnyFiles) {
      const filename = file.ObjectName;
      const normFile = normalize(filename);
      
      let score = 0;
      
      // 1. Exact combined match (Brand+Name)
      if (normFile.includes(combined)) score += 10;
      
      // 2. Contains both brand and name separately
      if (normBrand && normFile.includes(normBrand)) score += 5;
      if (normName && normFile.includes(normName)) score += 5;
      
      // 3. Numeric prefix match (if product_code matches)
      if (p.product_code && filename.startsWith(p.product_code)) score += 20;

      // 4. Word overlap score
      const nameWords = normName.split(/(?:)/u).filter(w => w.length > 2);
      nameWords.forEach(w => { if (normFile.includes(w)) score += 1; });

      if (score > highestScore) {
        highestScore = score;
        bestFile = filename;
      }
    }

    // High confidence threshold
    if (bestFile && highestScore >= 12) {
      // Correct URL construction
      const url = `${BOTTLE_CDN}/${encodeURIComponent(bestFile)}`;
      matches.push({ id: p.id, image_url: url, debug: `${p.brand} ${p.name} -> ${bestFile} (Score: ${highestScore})` });
    }
  }

  console.log(`Found ${matches.length} safe matches.`);
  
  if (matches.length > 0) {
    for (const m of matches) {
      console.log(`Updating: ${m.debug}`);
      const { error: upError } = await supabase
        .from("products")
        .update({ image_url: m.image_url })
        .eq("id", m.id);
      
      if (upError) console.error(`Error updating ${m.id}:`, upError.message);
    }
    console.log("Bulk update complete.");
  } else {
    console.log("No high-confidence matches found in this set.");
  }
}

startMatching();
