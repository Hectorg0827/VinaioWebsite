import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    const syncToken = process.env.SYNC_TOKEN;

    // 1. Secure with Bearer Token
    if (!syncToken || authHeader !== `Bearer ${syncToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customers, invoices, invoice_items, payments } = await req.json();

    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ error: "Server missing service key" }, { status: 500 });

    // 2. Sync Customers (Identify by account_number/qbd_id)
    // Note: This matches the QBD ID to the Supabase customer profile
    if (customers?.length) {
      // For each customer from QBD, we update the profile where account_number matches
      for (const c of customers) {
        await admin
          .from("customers")
          .update({ 
            balance: c.balance, 
            credit_limit: c.credit_limit || 0 
          })
          .eq("account_number", c.qbd_id);
      }
    }

    // 3. Sync Invoices
    if (invoices?.length) {
      // Find the internal customer_id for each invoice via qbd_id
      const invoicesWithIds = [];
      for (const inv of invoices) {
        const { data: profile } = await admin
          .from("customers")
          .select("id")
          .eq("account_number", inv.qbd_customer_id)
          .single();
        
        if (profile) {
          invoicesWithIds.push({
            ...inv,
            id: inv.qbd_id, // QBD unique ID
            customer_id: profile.id,
          });
        }
      }

      if (invoicesWithIds.length) {
        const { error: invErr } = await admin
          .from("invoices")
          .upsert(invoicesWithIds.map(({qbd_id, qbd_customer_id, ...rest}) => rest));
        if (invErr) console.error("Invoice sync error:", invErr);
      }
    }

    // 4. Sync Invoice Line Items (Sales History)
    if (invoice_items?.length) {
      const itemsToSync = [];
      for (const item of invoice_items) {
        // We link history to the customer_id for RLS isolation
        const { data: profile } = await admin
          .from("customers")
          .select("id")
          .eq("account_number", item.qbd_customer_id)
          .single();

        if (profile) {
          itemsToSync.push({
            invoice_id: item.qbd_invoice_id,
            customer_id: profile.id,
            product_name: item.product_name,
            sku: item.sku,
            qty: item.qty,
            unit_price: item.unit_price,
            invoice_date: item.invoice_date
          });
        }
      }

      if (itemsToSync.length) {
        const { error: histErr } = await admin
          .from("invoice_items")
          .upsert(itemsToSync);
        if (histErr) console.error("History sync error:", histErr);
      }
    }

    // 5. Sync Payment History
    if (payments?.length) {
      const paymentsToSync = [];
      for (const p of payments) {
        const { data: profile } = await admin
          .from("customers")
          .select("id")
          .eq("account_number", p.qbd_customer_id)
          .single();
        
        if (profile) {
          paymentsToSync.push({
            id: p.qbd_payment_id,
            customer_id: profile.id,
            amount: p.amount,
            method: p.method,
            payment_date: p.payment_date,
            memo: p.memo
          });
        }
      }
      if (paymentsToSync.length) {
        await admin.from("payment_history").upsert(paymentsToSync);
      }
    }

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });

  } catch (err) {
    console.error("Sync Endpoint Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
