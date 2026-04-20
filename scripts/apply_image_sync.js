const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');

async function applySync() {
  const matches = JSON.parse(fs.readFileSync('/tmp/matching-data.json', 'utf8'));
  const supabaseUrl = "https://yzcmfepqjdybavpsjbwm.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Starting update for ${matches.length} products...`);

  let successCount = 0;
  let errorCount = 0;

  for (const match of matches) {
    const { error } = await supabase
      .from("products")
      .update({ image_url: match.new_url })
      .eq("id", match.id);

    if (error) {
      console.error(`Error updating product ${match.id} (${match.name}):`, error.message);
      errorCount++;
    } else {
      successCount++;
      if (successCount % 20 === 0) console.log(`Processed ${successCount}...`);
    }
  }

  console.log("-----------------------------------");
  console.log(`Sync Complete!`);
  console.log(`Successfully Updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

applySync();
