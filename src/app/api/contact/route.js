import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, license_number, email, phone, inquiry_type, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Store in Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      await supabase.from("contact_submissions").insert({
        name,
        company:        company   || null,
        license_number: license_number || null,
        email,
        phone:          phone     || null,
        inquiry_type:   inquiry_type || "general",
        message,
      });
    }

    // TODO: send notification email via Resend/SendGrid here

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit form." }, { status: 500 });
  }
}
