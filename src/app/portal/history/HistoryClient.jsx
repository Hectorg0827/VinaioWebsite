"use client";

import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Badge from "@/components/Badge";

const fmt = (n) =>
  typeof n === "number" ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const MOCK_ORDERS = [
  { id: "mock-1", created_at: "2026-03-20", total: 2850.00, status: "processing", tracking: null, order_items: [{ qty: 12 }, { qty: 24 }] },
  { id: "mock-2", created_at: "2026-03-12", total: 4250.00, status: "shipped",    tracking: "1Z999AA10123456784", order_items: [{ qty: 6 }, { qty: 12 }, { qty: 6 }] },
  { id: "mock-3", created_at: "2026-02-25", total: 2180.50, status: "delivered",  tracking: "1Z999AA10123456700", order_items: [{ qty: 12 }] },
];

export default function HistoryClient({ orders }) {
  const data = orders.length ? orders : MOCK_ORDERS;

  const itemCount = (order) =>
    order.order_items?.reduce((s, i) => s + (i.qty || 0), 0) ?? 0;

  return (
    <>
      <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Order History</h2>
      <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, marginBottom: "32px" }}>Review past orders and reorder with one click</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((o) => {
          const items = itemCount(o);
          return (
            <div key={o.id} style={{ padding: "24px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink }}>
                    {o.id.length > 12 ? o.id.slice(0, 8).toUpperCase() : o.id}
                  </span>
                  <Badge status={o.status} />
                </div>
                <span style={{ fontFamily: ff.h, fontSize: "20px", color: T.ink }}>{fmt(o.total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted }}>
                  {fmtDate(o.created_at)}
                  {items > 0 ? ` · ${items} items` : ""}
                  {o.tracking ? ` · Tracking: ${o.tracking}` : ""}
                </span>
                <div style={{ display: "flex", gap: "12px" }}>
                  {o.status === "delivered" && (
                    <Link href="/portal/reorder" style={{ fontFamily: ff.b, fontSize: "11px", color: T.wine, fontWeight: 600 }}>Reorder →</Link>
                  )}
                  <span style={{ fontFamily: ff.b, fontSize: "11px", color: T.blue, fontWeight: 600, cursor: "pointer" }}>View Details</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
