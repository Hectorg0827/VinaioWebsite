import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ── QuickBooks bridge configuration ──────────────────────────────────────────
// To connect your QuickBooks Desktop, set these env vars:
//   QB_BRIDGE_URL   — URL of your QuickBooks Web Connector bridge
//                     e.g. https://your-bridge.example.com/invoices
//   QB_BRIDGE_TOKEN — API token for the bridge (keep server-side only)
//
// The bridge reads open invoices for the given account number and returns them.
// Data is returned to the customer and NEVER written to this database.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req) {
  // ── Auth: only authenticated portal users ────────────────────────────────
  let user = null;
  let accountNumber = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      const { data: c } = await supabase
        .from("customers")
        .select("account_number")
        .eq("id", user.id)
        .single();
      accountNumber = c?.account_number ?? null;
    }
  } catch {
    // Supabase not configured — allow demo mode
  }

  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseConfigured && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── QuickBooks live fetch ─────────────────────────────────────────────────
  const bridgeUrl   = process.env.QB_BRIDGE_URL;
  const bridgeToken = process.env.QB_BRIDGE_TOKEN;

  if (bridgeUrl && bridgeToken && accountNumber) {
    try {
      const res = await fetch(`${bridgeUrl}?account=${encodeURIComponent(accountNumber)}`, {
        headers: {
          Authorization: `Bearer ${bridgeToken}`,
          "Content-Type": "application/json",
        },
        // Hard 8-second timeout — if QuickBooks is slow, fail fast
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) throw new Error(`Bridge returned ${res.status}`);

      const data = await res.json();
      // Bridge should return: { invoices: [ { id, date, due, amount, balance, status, age, lines } ] }
      return NextResponse.json({ invoices: data.invoices ?? [], source: "quickbooks" });
    } catch (err) {
      console.error("QuickBooks bridge error:", err.message);
      return NextResponse.json({ error: "Could not reach QuickBooks. Please try again or contact your rep." }, { status: 502 });
    }
  }

  // ── Demo / fallback data (shown when bridge is not yet configured) ────────
  // Remove this block once QB_BRIDGE_URL + QB_BRIDGE_TOKEN are set in Vercel.
  const demoInvoices = [
    {
      id: "INV-8841", date: "Feb 3, 2026", due: "Mar 5, 2026",
      amount: 1250.00, balance: 1250.00, status: "Overdue", age: 32,
      lines: [
        { desc: "Kalembu Ron 750ml × 24 btl (2 cases)",       amount: 900.00  },
        { desc: "Candela Mamajuana 750ml × 6 btl (1 case)",   amount: 350.00  },
      ],
    },
    {
      id: "INV-8902", date: "Feb 18, 2026", due: "Mar 18, 2026",
      amount: 1842.00, balance: 1842.00, status: "Current", age: 19,
      lines: [
        { desc: "La Fuerza Blanco 750ml × 24 btl (2 cases)",  amount: 1044.00 },
        { desc: "Kalembu Ron 750ml × 12 btl (1 case)",        amount: 798.00  },
      ],
    },
    {
      id: "INV-8954", date: "Mar 1, 2026", due: "Apr 1, 2026",
      amount: 2215.50, balance: 2215.50, status: "Current", age: 1,
      lines: [
        { desc: "Mack Albert Reserve 750ml × 6 btl (1 case)", amount: 840.00  },
        { desc: "Macorix Extra Añejo 750ml × 24 btl (2 cases)", amount: 1375.50 },
      ],
    },
    {
      id: "INV-9012", date: "Mar 15, 2026", due: "Apr 15, 2026",
      amount: 3113.00, balance: 3113.00, status: "Current", age: -14,
      lines: [
        { desc: "La Fuerza Tinto 750ml × 48 btl (4 cases)",   amount: 1464.00 },
        { desc: "Dupuy Barceló Añejo 750ml × 12 btl (2 cases)", amount: 1649.00 },
      ],
    },
  ];

  return NextResponse.json({ invoices: demoInvoices, source: "demo" });
}
