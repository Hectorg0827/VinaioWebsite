const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  const sql = fs.readFileSync('supabase/migrations/20260415_products_rls.sql', 'utf8');
  console.log('Applying products RLS migration...');
  const { error } = await supabase.rpc('exec_sql', { sql }).catch(() => ({ error: null }));
  
  // Try direct REST call if rpc not available
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ sql })
  });

  if (!res.ok) {
    console.log('Note: Direct SQL exec not available via REST (expected). Please apply via Supabase Dashboard SQL Editor.');
    console.log('\nSQL to run:\n');
    console.log(sql);
  } else {
    console.log('✅ Migration applied successfully!');
  }
}

// Print SQL for manual application
console.log('\n=== SQL to apply in Supabase Dashboard > SQL Editor ===\n');
console.log(fs.readFileSync('supabase/migrations/20260415_products_rls.sql', 'utf8'));
console.log('\n=== End SQL ===\n');
applyMigration();
