const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const dotenv = require("dotenv");
const env = dotenv.parse(fs.readFileSync(".env.local"));
const supabase = createClient("https://yzcmfepqjdybavpsjbwm.supabase.co", env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from("products").select("brand, name, image_url").ilike("categories", "%Rum%");
  if (error) console.error(error);
  else console.table(data);
}
run();
