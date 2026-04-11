import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, company, name, phone, license_number } = body;

    if (!email || !password || !company || !name) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Create Auth User
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Manual approval flow; we can confirm email immediately or later
      user_metadata: { full_name: name, company }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Create Customer Profile with 'pending' status
    const { error: profileError } = await admin
      .from("customers")
      .insert([{
        id: userId,
        company,
        rep_name: name, // Temporary mapping
        status: "pending",
        // account_number could be generated here or by admin later
      }]);

    if (profileError) {
      // Cleanup auth user if profile fails
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // 3. Optional: Insert into licenses if provided
    if (license_number) {
      await admin.from("licenses").insert([{
        customer_id: userId,
        number: license_number,
        status: "pending"
      }]);
    }

    // 4. Log the registration
    await admin.from("portal_logs").insert([{
      customer_id: userId,
      action: "registration_submitted",
      details: { company, email }
    }]);

    return NextResponse.json({ success: true, message: "Registration submitted for approval." });

  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
