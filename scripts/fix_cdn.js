const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/hectorgarcia/VinaioWebsite/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixCDN() {
  console.log("Starting CDN URL fix...");
  const { data: products, error } = await supabase.from('products').select('id, image_url, logo_url');
  
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  let updatedCount = 0;

  for (const p of products) {
    let needsUpdate = false;
    let updates = {};

    if (p.image_url && p.image_url.includes('vinaio-bottles.b-cdn.net')) {
      updates.image_url = p.image_url.replace('vinaio-bottles.b-cdn.net', 'vinaio-bottles-cdn.b-cdn.net');
      needsUpdate = true;
    }
    
    if (p.logo_url && p.logo_url.includes('vinaio-bottles.b-cdn.net')) {
      updates.logo_url = p.logo_url.replace('vinaio-bottles.b-cdn.net', 'vinaio-bottles-cdn.b-cdn.net');
      needsUpdate = true;
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', p.id);
        
      if (updateError) {
        console.error(`Failed to update ${p.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Finished CDN fix. Updated ${updatedCount} products.`);
}

fixCDN();
