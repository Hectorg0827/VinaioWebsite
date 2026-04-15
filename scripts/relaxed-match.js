const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const files = JSON.parse(fs.readFileSync('/tmp/bunny-files.json', 'utf8'));
const BCDN_URL = "https://vinaio-imports.b-cdn.net"; // Base for bottleimages per previous match

async function relaxedMatch() {
  console.log("Fetching products from Supabase...");
  const { data: products, error } = await supabase.from('products').select('id, brand, name, image_url');
  
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  const matches = [];

  for (const p of products) {
    if (p.image_url) continue; // Skip already matched

    const brand = (p.brand || "").toLowerCase().trim();
    const name = (p.name || "").toLowerCase().trim();
    
    // Look for files where the path contains the brand name
    const found = files.find(f => {
      const fLower = f.toLowerCase();
      // Check if path contains brand AND (name or part of name)
      // Special case: brand folder
      if (fLower.includes(`/${brand}/`) || fLower.split('/').pop().startsWith(brand)) {
        // If brand matched, check if name matches or if it's the only file in brand folder
        if (fLower.includes(name.split(' ')[0])) return true;
        // If it's a generic "bottle" or "logo" we might skip bottle images
        if (fLower.includes("botella") || fLower.includes("bottle")) return true;
        // If brand folder has very few files, take the first one?
        return true; 
      }
      return false;
    });

    if (found) {
      const url = `${BCDN_URL}/${encodeURI(found)}`;
      console.log(`Matched: ${p.brand} ${p.name} -> ${found}`);
      matches.push({ id: p.id, image_url: url });
    }
  }

  console.log(`Found ${matches.length} new matches.`);

  for (const m of matches) {
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: m.image_url })
      .eq('id', m.id);
    
    if (updateError) console.error(`Failed to update ${m.id}:`, updateError);
  }

  console.log("Update complete.");
}

relaxedMatch();
