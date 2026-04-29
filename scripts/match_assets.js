const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CDN_BASE = 'https://vinaio-bottles-cdn.b-cdn.net';

// Helper to check if a URL returns 200 OK
function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    }).end();
  });
}

function encodeSafe(str) {
  if (!str) return '';
  return encodeURIComponent(str).replace(/%20/g, '%20'); // keep spaces as %20
}

async function matchAssets() {
  console.log("Fetching products with missing assets...");
  const { data: products, error } = await supabase.from('products').select('id, brand, name, image_url, logo_url');
  
  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  const missingImage = products.filter(p => !p.image_url);
  const missingLogo = products.filter(p => !p.logo_url);

  console.log(`Missing Images: ${missingImage.length}, Missing Logos: ${missingLogo.length}`);

  let updatedImages = 0;
  let updatedLogos = 0;

  // Process Images (batch to not overwhelm)
  for (const p of missingImage) {
    if (!p.brand || !p.name) continue;
    
    const brandSafe = encodeSafe(p.brand);
    const nameSafe = encodeSafe(p.name);
    
    // Likely image URLs
    const imageCandidates = [
      `${CDN_BASE}/${nameSafe}.png`,
      `${CDN_BASE}/${brandSafe}%20${nameSafe}.png`,
      `${CDN_BASE}/Fotos%20de%20Botellas%20(6%20apr%202026)/${brandSafe}/${nameSafe}.png`,
      `${CDN_BASE}/Fotos%20de%20Botellas%20(6%20apr%202026)/${brandSafe}/${encodeSafe(p.name.toLowerCase().replace(/ /g, '-'))}.png`
    ];

    for (const url of imageCandidates) {
      if (await checkUrl(url)) {
        console.log(`Found image for ${p.name}: ${url}`);
        await supabase.from('products').update({ image_url: url }).eq('id', p.id);
        updatedImages++;
        break; // found one, move to next product
      }
    }
  }

  // Process Logos
  for (const p of missingLogo) {
    if (!p.brand) continue;
    
    const brandSafe = encodeSafe(p.brand);
    
    const logoCandidates = [
      `${CDN_BASE}/logos/${brandSafe}%20logo.svg`,
      `${CDN_BASE}/logos/${brandSafe}%20logo.png`,
      `${CDN_BASE}/logos/${brandSafe}.svg`,
      `${CDN_BASE}/logos/${brandSafe}.png`,
      `${CDN_BASE}/logos/${encodeSafe(p.brand.toLowerCase())}-logo.svg`
    ];

    for (const url of logoCandidates) {
      if (await checkUrl(url)) {
        console.log(`Found logo for ${p.brand}: ${url}`);
        await supabase.from('products').update({ logo_url: url }).eq('id', p.id);
        updatedLogos++;
        break;
      }
    }
  }

  console.log(`\nFinished matching.`);
  console.log(`Images found and updated: ${updatedImages}/${missingImage.length}`);
  console.log(`Logos found and updated: ${updatedLogos}/${missingLogo.length}`);
}

matchAssets();
