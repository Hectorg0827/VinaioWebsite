
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProduct() {
  const productId = 'c1044083-4cd9-447e-8c7f-c1d55fc2f92d';
  
  // First, get the current state to be sure
  const { data: product, error: getError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (getError) {
    console.error('Error fetching product:', getError);
    return;
  }

  console.log('Current portfolios for', product.name, ':', product.portfolios);

  // Filter out the incorrect ones and ensure 'spain' is there if it's a Rioja (which 6 Cepas 6 is)
  const newPortfolios = product.portfolios.filter(p => p !== 'caribbean' && p !== 'kosher' && p !== 'beer_low_alc');
  if (!newPortfolios.includes('spain')) {
    newPortfolios.push('spain');
  }

  console.log('New portfolios:', newPortfolios);

  const { error: updateError } = await supabase
    .from('products')
    .update({ portfolios: newPortfolios })
    .eq('id', productId);

  if (updateError) {
    console.error('Error updating product:', updateError);
  } else {
    console.log('Successfully updated product portfolios.');
  }
}

fixProduct();
