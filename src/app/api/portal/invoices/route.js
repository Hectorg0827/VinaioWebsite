import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  let user = null;
  let customerDetails = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      // Get the customer record associated with this user
      const { data: c } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .single();
      customerDetails = c;
    }
  } catch (err) {
    console.error("Auth helper failed:", err);
  }

  // Use a hard-coded check for Supabase URL as well
  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseConfigured && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Pull live synced data from Supabase ──────────────────────────────────
  if (user) {
    try {
      const supabase = await createClient();
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("customer_id", user.id)
        .order("due_date", { ascending: false });

      if (error) throw error;

      return NextResponse.json({ 
        invoices: invoices || [], 
        source: "quickbooks_synced",
        lastSync: customerDetails?.last_sync_at 
      });
    } catch (err) {
      console.error("Supabase fetch failed:", err);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  // ── Fallback for dev/unauthenticated ─────────────────────────────────────
  return NextResponse.json({ 
    invoices: [], 
    source: "none",
    message: "No user session found."
  });
}
