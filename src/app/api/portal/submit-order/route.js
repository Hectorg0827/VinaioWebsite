import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  let user = null;
  let customerProfile = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      const { data: c } = await supabase
        .from("customers")
        .select("company, account_number, rep_name, rep_email")
        .eq("id", user.id)
        .single();
      customerProfile = c;
    }
  } catch {
    // Supabase not configured — allow for local dev/demo
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  const body = await req.json().catch(() => ({}));
  const { cart, po, notes, total, customerOverride } = body;

  if (!cart?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Allow demo mode (no auth) when Supabase isn't configured
  const customerName    = customerProfile?.company         ?? customerOverride?.name    ?? "Portal Customer";
  const accountNumber   = customerProfile?.account_number  ?? customerOverride?.account ?? "DEMO";
  const customerEmail   = user?.email                      ?? customerOverride?.email   ?? null;
  const repName         = customerProfile?.rep_name        ?? "Vinaio Team";
  const repEmail        = customerProfile?.rep_email       ?? null;

  // ── Format email ──────────────────────────────────────────────────────────
  const orderDate = new Date().toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short",
  });

  const lineRows = cart.map((item) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #E2DAD0;font-family:sans-serif;font-size:13px;color:#1E1E1E">
        <strong>${item.name}</strong><br>
        <span style="color:#8A7F75;font-size:11px">${item.sku}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #E2DAD0;font-family:monospace;font-size:13px;text-align:right">${item.qty}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #E2DAD0;font-family:monospace;font-size:13px;text-align:right">${item.btlPerCase} btl</td>
      <td style="padding:10px 14px;border-bottom:1px solid #E2DAD0;font-family:monospace;font-size:13px;text-align:right">$${item.price.toFixed(2)}/btl</td>
      <td style="padding:10px 14px;border-bottom:1px solid #E2DAD0;font-family:monospace;font-size:13px;font-weight:700;text-align:right">$${(item.price * item.btlPerCase * item.qty).toFixed(2)}</td>
    </tr>`).join("");

  const orderHtml = `
    <div style="font-family:sans-serif;max-width:680px;margin:0 auto;background:#FEFCF8">
      <div style="background:#7B2035;padding:24px 32px">
        <div style="font-size:22px;color:#FEFCF8;font-weight:700;letter-spacing:2px">VINAIO IMPORTS</div>
        <div style="font-size:11px;color:#E8D5A3;margin-top:4px;letter-spacing:1px;text-transform:uppercase">New Order Received via B2B Portal</div>
      </div>

      <div style="padding:28px 32px;background:#FEFCF8;border-bottom:1px solid #E2DAD0">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:6px 0;color:#8A7F75;font-size:12px;width:160px">Customer</td>
            <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1E1E1E">${customerName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8A7F75;font-size:12px">Account #</td>
            <td style="padding:6px 0;font-size:13px;color:#1E1E1E">${accountNumber}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8A7F75;font-size:12px">Contact Email</td>
            <td style="padding:6px 0;font-size:13px;color:#1E1E1E">${customerEmail ?? "—"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8A7F75;font-size:12px">PO / Reference #</td>
            <td style="padding:6px 0;font-size:13px;color:#1E1E1E">${po || "—"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8A7F75;font-size:12px">Order Date</td>
            <td style="padding:6px 0;font-size:13px;color:#1E1E1E">${orderDate}</td>
          </tr>
          ${notes ? `<tr>
            <td style="padding:6px 0;color:#8A7F75;font-size:12px;vertical-align:top">Notes</td>
            <td style="padding:6px 0;font-size:13px;color:#1E1E1E;white-space:pre-wrap">${notes}</td>
          </tr>` : ""}
        </table>
      </div>

      <div style="padding:0 32px 28px">
        <table style="width:100%;border-collapse:collapse;margin-top:24px">
          <thead>
            <tr style="background:#F5F0E8">
              <th style="padding:10px 14px;font-size:10px;color:#8A7F75;text-transform:uppercase;letter-spacing:0.5px;text-align:left;font-weight:600">Product</th>
              <th style="padding:10px 14px;font-size:10px;color:#8A7F75;text-transform:uppercase;letter-spacing:0.5px;text-align:right;font-weight:600">Cases</th>
              <th style="padding:10px 14px;font-size:10px;color:#8A7F75;text-transform:uppercase;letter-spacing:0.5px;text-align:right;font-weight:600">Per Case</th>
              <th style="padding:10px 14px;font-size:10px;color:#8A7F75;text-transform:uppercase;letter-spacing:0.5px;text-align:right;font-weight:600">Unit Price</th>
              <th style="padding:10px 14px;font-size:10px;color:#8A7F75;text-transform:uppercase;letter-spacing:0.5px;text-align:right;font-weight:600">Subtotal</th>
            </tr>
          </thead>
          <tbody>${lineRows}</tbody>
          <tfoot>
            <tr style="background:#7B2035">
              <td colspan="4" style="padding:14px;font-size:14px;font-weight:700;color:#FEFCF8;font-family:sans-serif">Order Total</td>
              <td style="padding:14px;font-family:monospace;font-size:18px;font-weight:700;color:#FEFCF8;text-align:right">$${(total ?? 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="padding:16px 32px 28px">
        <div style="background:#FEF3DC;border:1px solid #E8C97C;border-radius:8px;padding:14px 18px;font-size:12px;color:#7A4F10;font-family:sans-serif;line-height:1.6">
          📋 <strong>Action Required:</strong> Process this order in your system and confirm receipt to <a href="mailto:${customerEmail}" style="color:#7A4F10">${customerEmail ?? "the customer"}</a>.
        </div>
      </div>

      <div style="padding:16px 32px;background:#F5F0E8;border-top:1px solid #E2DAD0">
        <div style="font-size:11px;color:#8A7F75;font-family:sans-serif">Submitted via Vinaio B2B Customer Portal · ${orderDate}</div>
      </div>
    </div>`;

  // ── Send emails via Resend ────────────────────────────────────────────────
  const resendKey    = process.env.RESEND_API_KEY;
  const ordersEmail  = process.env.ORDER_NOTIFY_EMAIL ?? "orders@vinaioimports.com";
  const fromAddress  = "Vinaio Portal <noreply@vinaioimports.com>";

  if (resendKey) {
    // 1. Notify order team
    await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from:    fromAddress,
        to:      [ordersEmail, ...(repEmail ? [repEmail] : [])],
        subject: `New Order — ${customerName} (${accountNumber})${po ? ` · PO: ${po}` : ""} — $${(total ?? 0).toFixed(2)}`,
        html:    orderHtml,
      }),
    });

    // 2. Customer confirmation
    if (customerEmail) {
      await fetch("https://api.resend.com/emails", {
        method:  "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:    fromAddress,
          to:      [customerEmail],
          subject: `Order Confirmation — ${po ? `PO ${po} · ` : ""}$${(total ?? 0).toFixed(2)} — Vinaio Imports`,
          html:    orderHtml.replace(
            "📋 <strong>Action Required:</strong>",
            "✅ <strong>Your order has been received.</strong> Our team will process it and reach out if any clarification is needed."
          ),
        }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
