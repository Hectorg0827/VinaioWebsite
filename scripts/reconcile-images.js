const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const dotenv = require("dotenv");

// Load env
const env = dotenv.parse(fs.readFileSync(".env.local"));
const supabase = createClient("https://yzcmfepqjdybavpsjbwm.supabase.co", env.SUPABASE_SERVICE_ROLE_KEY);

const STORAGE_ZONE = "bottleimages1";
const STORAGE_PASSWORD = "e3cca9fc-08ac-4876-9e09c6c5f1c6-f32c-437e";
const BOTTLE_CDN = "https://vinaio-bottles-cdn.b-cdn.net";

async function fetchRecursive(path = "") {
  console.log(`Scanning: ${path || "/"}`);
  const url = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${path}`;
  const res = await fetch(url, {
    headers: { "AccessKey": STORAGE_PASSWORD }
  });
  
  if (!res.ok) {
    console.error(`Failed to fetch ${url}: ${res.status}`);
    return [];
  }

  const items = await res.json();
  let files = [];

  for (const item of items) {
    if (item.IsDirectory) {
      const subFiles = await fetchRecursive(`${path}${item.ObjectName}/`);
      files = files.concat(subFiles);
    } else {
      files.push(`${path}${item.ObjectName}`);
    }
  }
  return files;
}

function normalize(str) {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, "");    // Keep only letters/numbers
}

async function reconcile() {
  console.log("--- Starting Deep Match ---");
  
  const allFiles = await fetchRecursive();
  console.log(`Found ${allFiles.length} files in Bunny.net.`);

  const { data: products, error } = await supabase.from("products").select("id, brand, name, image_url, product_code");
  if (error) throw error;

  const updates = [];

  for (const p of products) {
    // Force re-matching for all that don't have a working link or were missing
    const isPlaceholder = !p.image_url || p.image_url.includes("placeholder");
    const isOldBrokenHost = p.image_url && p.image_url.includes("vinaio-bottles.b-cdn.net");
    const isWrongAccountHost = p.image_url && p.image_url.includes("vinaioimports.b-cdn.net");
    
    if (!isPlaceholder && !isOldBrokenHost && !isWrongAccountHost) continue;

    const normBrand = normalize(p.brand);
    const normName = normalize(p.name);
    
    let bestFile = null;
    let highestScore = 0;

    for (const file of allFiles) {
      const filename = file.split("/").pop();
      const normFile = normalize(filename);
      
      let score = 0;
      
      // Exact match for name + brand in filename
      if (normFile.includes(normBrand) && normFile.includes(normName)) score += 20;
      else if (normFile.includes(normName)) score += 10;
      else if (normFile.includes(normBrand)) score += 5;

      // Product code match (Strong)
      if (p.product_code && filename.includes(p.product_code)) score += 25;

      if (score > highestScore) {
        highestScore = score;
        bestFile = file;
      }
    }

    if (bestFile && highestScore >= 5) {
      const url = BOTTLE_CDN + "/" + bestFile.split("/").map(s => encodeURIComponent(s.normalize("NFC"))).join("/");
      updates.push({ id: p.id, image_url: url, debug: `${p.brand} ${p.name} -> ${bestFile} (Score: ${highestScore})` });
    }
  }

  // Final Step: Also migrate anyone who had an old host but their filename exists in the root
  for (const p of products) {
    if (p.image_url && p.image_url.includes("vinaio-bottles.b-cdn.net")) {
      const filename = decodeURIComponent(p.image_url.split("/").pop());
      const normalizedFilename = filename.normalize("NFC");
      const match = allFiles.find(f => f.split("/").pop().normalize("NFC") === normalizedFilename);
      if (match) {
         const url = BOTTLE_CDN + "/" + match.split("/").map(s => encodeURIComponent(s.normalize("NFC"))).join("/");
         if (url !== p.image_url) {
            updates.push({ id: p.id, image_url: url, debug: `Migrating existing: ${p.name} -> ${match}` });
         }
      }
    }
  }

  console.log(`Found ${updates.length} potential matches.`);

  for (const up of updates) {
    console.log(`Matching: ${up.debug}`);
    await supabase.from("products").update({ image_url: up.image_url }).eq("id", up.id);
  }

  console.log("--- Update Complete ---");
}

reconcile();
