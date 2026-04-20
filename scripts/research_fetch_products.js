const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');

async function fetchProducts() {
  const supabaseUrl = "https://yzcmfepqjdybavpsjbwm.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("products")
    .select("id, name, brand, producer, type, product_code, image_url");

  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  fs.writeFileSync("/tmp/supabase-products.json", JSON.stringify(data, null, 2));
  console.log(`Fetched ${data.length} products to /tmp/supabase-products.json`);
}

fetchProducts();
