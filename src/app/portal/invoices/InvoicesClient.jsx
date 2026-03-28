"use client";

import { T, ff } from "@/lib/theme";
import Badge from "@/components/Badge";

const fmt = (n) =>
  typeof n === "number" ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

// Fallback mock for empty state demo
const MOCK = [
  { id: "inv-1", created_at: "2026-03-15", due_date: "2026-04-14", amount: 4250.00, paid: 0, status: "open" },
  { id: "inv-2", created_at: "2026-02-28", due_date: "2026-03-30", amount: 2180.50, paid: 0, status: "overdue" },
  { id: "inv-3", created_at: "2026-02-10", due_date: "2026-03-12", amount: 3420.00, paid: 3420.00, status: "paid" },
];

export default function InvoicesClient({ invoices }) {
  const data = invoices.length ? invoices : MOCK;

  return (
    <>
      <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Invoices</h2>
      <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, marginBottom: "32px" }}>
        Track and pay your outstanding invoices
      </p>

      <div style={{ background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 0.8fr", padding: "14px 24px", background: T.cream, gap: "12px" }}>
          {["Invoice", "Date", "Due Date", "Amount", "Paid", "Status"].map((h) => (
            <span key={h} style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, fontWeight: 600 }}>{h}</span>
          ))}
        </div>

        {data.map((inv, i) => (
          <div
            key={inv.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 0.8fr",
              padding: "18px 24px",
              gap: "12px",
              borderBottom: i < data.length - 1 ? `1px solid ${T.cream}` : "none",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: ff.b, fontSize: "13px", fontWeight: 600, color: T.ink }}>
              {inv.id.length > 12 ? inv.id.slice(0, 8).toUpperCase() : inv.id}
            </span>
            <span style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted }}>{fmtDate(inv.created_at)}</span>
            <span style={{ fontFamily: ff.b, fontSize: "13px", color: inv.status === "overdue" ? T.red : T.muted }}>{fmtDate(inv.due_date)}</span>
            <span style={{ fontFamily: ff.h, fontSize: "16px", color: T.ink }}>{fmt(inv.amount)}</span>
            <span style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted }}>{fmt(inv.paid)}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Badge status={inv.status} />
              {inv.status !== "paid" && (
                <span style={{ fontFamily: ff.b, fontSize: "10px", color: T.wine, fontWeight: 600, cursor: "pointer" }}>Pay</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {invoices.length === 0 && (
        <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, textAlign: "center", marginTop: "16px" }}>
          Showing sample data — connect your account to see real invoices.
        </p>
      )}
    </>
  );
}
