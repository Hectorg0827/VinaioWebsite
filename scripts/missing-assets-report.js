const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateReport() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, brand, name, type, origin, image_url, logo_url')
    .order('brand');

  if (error) { console.error(error); return; }

  const missingBottle  = products.filter(p => !p.image_url);
  const missingLogo    = products.filter(p => !p.logo_url);
  const missingBoth    = products.filter(p => !p.image_url && !p.logo_url);

  console.log(`\nTotal products  : ${products.length}`);
  console.log(`Missing bottle  : ${missingBottle.length}`);
  console.log(`Missing logo    : ${missingLogo.length}`);
  console.log(`Missing both    : ${missingBoth.length}`);

  // Write CSV
  const header = 'id,slug,brand,name,type,origin,missing_bottle,missing_logo';
  const rows = products.map(p =>
    [p.id, p.slug, p.brand, p.name, p.type, p.origin,
     !p.image_url ? 'YES' : '', !p.logo_url ? 'YES' : ''].join(',')
  ).filter(r => r.includes('YES'));

  const csvContent = [header, ...rows].join('\n');
  fs.writeFileSync('/tmp/missing_assets_report.csv', csvContent);
  console.log('\n✅ Report saved to /tmp/missing_assets_report.csv');
  console.log('\nTop missing bottle brands:');
  const brandCounts = {};
  missingBottle.forEach(p => { brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1; });
  Object.entries(brandCounts).sort((a,b) => b[1]-a[1]).slice(0,15).forEach(([b,c]) => console.log(`  ${b}: ${c} products`));
}

generateReport();
