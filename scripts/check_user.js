const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkUser(email) {
  console.log(`Checking status for: ${email}`);
  
  // 1. Check Auth
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Auth Error:", authError);
    return;
  }
  
  const authUser = users.find(u => u.email === email);
  if (authUser) {
    console.log(`✅ User exists in Auth. ID: ${authUser.id}`);
    
    // 2. Check Customers table
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', authUser.id)
      .single();
      
    if (custError) {
      console.log(`❌ User NOT found in customers table. Error: ${custError.message}`);
    } else {
      console.log(`✅ User found in customers table:`, customer);
    }
  } else {
    console.log(`❌ User NOT found in Auth.`);
  }
}

const emailToCheck = process.argv[2];
if (!emailToCheck) {
  console.log("Usage: node check_user.js <email>");
} else {
  checkUser(emailToCheck);
}
