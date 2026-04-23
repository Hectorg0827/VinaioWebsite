import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cart, total, notes } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: { user } } = await admin.auth.getUser(req.headers.get("Authorization")?.split(" ")[1]);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch customer details for the email
    const { data: customer } = await admin
      .from("customers")
      .select("*")
      .eq("id", user.id)
      .single();

    // 2. Insert Order into DB
    const { data: order, error: orderError } = await admin
      .from("portal_orders")
      .insert([{
        customer_id: user.id,
        total: total,
        notes: notes,
        status: "processing"
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Insert Order Items
    const { error: itemsError } = await admin
      .from("portal_order_items")
      .insert(cart.map(item => ({
        order_id: order.id,
        customer_id: user.id,
        product_id: item.id || item.slug, // flexibility
        product_name: item.name,
        qty: item.qty,
        price: item.price
      })));

    if (itemsError) throw itemsError;

    // 4. Send Email Notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const orderEmail = "orders@vinaioimports.com";

    if (resendKey) {
      const itemsHtml = cart.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
      `).join("");

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Vinaio Portal <portal@vinaioimports.com>",
            to: orderEmail,
            subject: `New Order: ${customer?.company || user.email}`,
            html: `
              <div style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #630d16;">New Order Received</h2>
                <p>A new order has been placed via the Customer Portal.</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Customer Info</h3>
                  <p style="margin: 5px 0;"><strong>Company:</strong> ${customer?.company || "N/A"}</p>
                  <p style="margin: 5px 0;"><strong>Contat:</strong> ${customer?.rep_name || user.email}</p>
                  <p style="margin: 5px 0;"><strong>Account #:</strong> ${customer?.account_number || "N/A"}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background: #f0f0f0;">
                      <th style="padding: 10px; text-align: left;">Product</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>

                <div style="text-align: right; font-size: 18px; font-weight: bold;">
                  Total: $${total.toFixed(2)}
                </div>

                ${notes ? `<p style="margin-top: 20px;"><strong>Notes:</strong><br/>${notes}</p>` : ""}

                <p style="margin-top: 40px; font-size: 12px; color: #999;">
                  This is an automated notification from the Vinaio Portal. 
                  Please process this order in QuickBooks.
                </p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error("Order email notification failed:", err);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (err) {
    console.error("Order Submit Error:", err);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
