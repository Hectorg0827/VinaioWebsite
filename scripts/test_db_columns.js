const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing ENV vars!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking products table schema...");
  const { data, error } = await supabase
    .from('products')
    .select('id, name, producer, summary, case_qty')
    .limit(1);

  if (error) {
    if (error.code === '42703') {
      console.error("COLUMNS MISSING: " + error.message);
      console.log("\nACTION REQUIRED: RUN THE SQL MIGRATION IN SUPABASE DASHBOARD.");
    } else {
      console.error("Error:", error);
    }
  } else {
    console.log("SUCCESS: Columns 'producer', 'summary', 'case_qty' exist in 'products' table.");
    console.log("Sample Data:", data);
  }
}

test();
