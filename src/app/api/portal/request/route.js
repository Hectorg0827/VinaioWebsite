import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, company, email, phone, license_number, message } = body;

    if (!email || !company || !name) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Log the request in the database
    const { data: requestData, error: dbError } = await admin
      .from("portal_requests")
      .insert([{
        full_name: name,
        company,
        email,
        phone,
        license_number,
        message,
        status: "pending"
      }])
      .select()
      .single();

    if (dbError) {
      console.error("DB Error saving request:", dbError);
      return NextResponse.json({ error: "Failed to store request" }, { status: 500 });
    }

    // 2. Email Notification to CS
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = "cs@vinaioimports.com";

    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Vinaio Portal <portal@vinaioimports.com>",
            to: adminEmail,
            subject: `New Portal Access Request: ${company}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
                <h2 style="color: #630d16;">New Portal Access Request</h2>
                <p>A new trade partner has requested access to the Vinaio Customer Portal.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Company:</td><td>${company}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: bold;">Contact Name:</td><td>${name}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${email}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${phone || "N/A"}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: bold;">License #:</td><td>${license_number || "N/A"}</td></tr>
                </table>
                <p style="margin-top: 20px; font-weight: bold;">Message:</p>
                <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #630d16; margin: 0;">
                  ${message || "No additional comments."}
                </blockquote>
                <div style="margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://vinaioimports.com'}/admin" 
                     style="background: #630d16; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    View in Admin Panel
                  </a>
                </div>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error("Failed to send notification email:", err);
        // We don't fail the request because the DB record was created successfully
      }
    }

    return NextResponse.json({ success: true, message: "Request received" });

  } catch (err) {
    console.error("Portal Request Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
