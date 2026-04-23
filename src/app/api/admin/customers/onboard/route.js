import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      requestId, 
      email, 
      password, 
      company, 
      repName, 
      licenseNumber, 
      qbdId 
    } = body;

    if (!email || !password || !company) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: repName, company }
    });

    if (authError) {
      console.error("Auth Error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Create/Update Customer Profile
    const { error: profileError } = await admin
      .from("customers")
      .upsert([{
        id: userId,
        company,
        rep_name: repName,
        license_number: licenseNumber,
        account_number: qbdId, // Link to QBD ID
        status: "active"
      }]);

    if (profileError) {
      // Cleanup
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // 3. Mark Request as Approved if requestId provided
    if (requestId) {
      await admin
        .from("portal_requests")
        .update({ status: "approved" })
        .eq("id", requestId);
    }

    // 4. Send Welcome Email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Vinaio Customer Service <cs@vinaioimports.com>",
            to: email,
            subject: "Welcome to the Vinaio Customer Portal",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
                <h2 style="color: #630d16;">Welcome to Vinaio Imports</h2>
                <p>Hello ${repName},</p>
                <p>Your trade account for <strong>${company}</strong> has been approved and your access to our Customer Portal is now active.</p>
                
                <div style="background: #fdf6f7; border: 1px solid #630d1620; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <p style="margin-top: 0; font-weight: bold; color: #630d16;">Your Account Details:</p>
                  <table style="width: 100%;">
                    <tr><td style="width: 120px; font-weight: bold;">Login Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Password:</td><td><code style="background: #eee; padding: 2px 6px; border-radius: 4px;">${password}</code></td></tr>
                  </table>
                </div>

                <p>Through the portal, you can now:</p>
                <ul>
                  <li>View your <strong>Bottle-by-Bottle</strong> purchase history</li>
                  <li>Check outstanding balances and payment history</li>
                  <li>Pay invoices online via the Intuit payment system</li>
                  <li>Place new orders directly with our team</li>
                </ul>

                <div style="margin-top: 30px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://vinaioimports.com'}/portal/login" 
                     style="background: #630d16; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Log In to Portal
                  </a>
                </div>

                <p style="margin-top: 40px; font-size: 13px; color: #666;">
                  For security, we recommend changing your password after your first login. 
                  If you have any questions, please contact your sales representative.
                </p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999;">Vinaio Imports · NY/NJ/CT · B2B Trade Portal</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Welcome email failed to send:", emailErr);
      }
    }

    return NextResponse.json({ success: true, userId });

  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
