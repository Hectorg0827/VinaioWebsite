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
        company:        company        || null,
        license_number: license_number || null,
        email,
        phone:          phone          || null,
        inquiry_type:   inquiry_type   || "general",
        message,
      });
    }

    // Send notification email via Resend
    const resendKey   = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;

    if (resendKey && notifyEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          from:    "Vinaio Imports <noreply@vinaioimports.com>",
          to:      [notifyEmail],
          subject: `New Contact Form — ${inquiry_type || "General"} from ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#6b1d2a">New Contact Form Submission</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#888;width:140px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
                ${company ? `<tr><td style="padding:8px 0;color:#888">Company</td><td style="padding:8px 0">${company}</td></tr>` : ""}
                ${phone ? `<tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0">${phone}</td></tr>` : ""}
                ${license_number ? `<tr><td style="padding:8px 0;color:#888">License #</td><td style="padding:8px 0">${license_number}</td></tr>` : ""}
                <tr><td style="padding:8px 0;color:#888">Inquiry Type</td><td style="padding:8px 0">${inquiry_type || "General"}</td></tr>
              </table>
              <hr style="margin:20px 0;border:none;border-top:1px solid #eee">
              <h3 style="color:#333;margin-bottom:8px">Message</h3>
              <p style="color:#444;line-height:1.7;white-space:pre-wrap">${message}</p>
              <hr style="margin:20px 0;border:none;border-top:1px solid #eee">
              <p style="color:#aaa;font-size:12px">Submitted via vinaioimports.com contact form</p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit form." }, { status: 500 });
  }
}
