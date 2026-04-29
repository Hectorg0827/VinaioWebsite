
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOverlap() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, brand, portfolios');

  if (error) {
    console.error(error);
    return;
  }

  const overlaps = products.filter(p => {
    const ports = p.portfolios || [];
    return ports.includes('caribbean') && ports.includes('kosher');
  });

  console.log('Products in both Caribbean and Kosher:');
  console.log(JSON.stringify(overlaps, null, 2));

  const destoInCaribbean = products.filter(p => {
    const brand = (p.brand || '').toLowerCase();
    const ports = p.portfolios || [];
    return brand.includes('desto') && ports.includes('caribbean');
  });

  console.log('\nDesto products in Caribbean portfolio:');
  console.log(JSON.stringify(destoInCaribbean, null, 2));

  const caribbeanInKosher = products.filter(p => {
    const brand = (p.brand || '').toLowerCase();
    const ports = p.portfolios || [];
    const caribbeanBrands = ['la fuerza', 'kalembu', 'bermudez', 'puntacana'];
    return caribbeanBrands.some(cb => brand.includes(cb)) && ports.includes('kosher');
  });

  console.log('\nCaribbean brands in Kosher portfolio:');
  console.log(JSON.stringify(caribbeanInKosher, null, 2));
}

checkOverlap();
