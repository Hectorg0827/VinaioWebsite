"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import { PRODUCTS } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

// Quick reorder shows frequently ordered items from last orders
const COMMON_ITEMS = [
  { ...PRODUCTS[0], lastQty: 12, lastDate: "Mar 12" },
  { ...PRODUCTS[2], lastQty: 48, lastDate: "Mar 12" },
  { ...PRODUCTS[4], lastQty: 6,  lastDate: "Feb 25" },
  { ...PRODUCTS[7], lastQty: 12, lastDate: "Feb 8"  },
];

export default function ReorderPage() {
  const [added, setAdded] = useState({});
  const [adding, setAdding] = useState(null);

  const reorder = async (item) => {
    setAdding(item.id);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Create order with single item
      const { data: order } = await supabase
        .from("orders")
        .insert({ customer_id: user.id, status: "processing", total: item.price * item.lastQty })
        .select().single();
      if (order) {
        await supabase.from("order_items").insert({
          order_id: order.id, product_id: item.id, qty: item.lastQty, unit_price: item.price,
        });
      }
    }

    setAdded((a) => ({ ...a, [item.id]: true }));
    setAdding(null);
  };

  return (
    <>
      <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Quick Reorder</h2>
      <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, marginBottom: "32px" }}>
        Reorder products from your recent purchases in one click
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {COMMON_ITEMS.map((item) => (
          <div
            key={item.id}
            style={{ padding: "20px 24px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <span style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.ink }}>{item.name}</span>
              <span style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, marginLeft: "12px" }}>
                Last ordered: {item.lastQty} units on {item.lastDate}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: ff.h, fontSize: "18px", color: T.wine }}>${item.price}</span>
              {added[item.id] ? (
                <div style={{ padding: "10px 20px", background: T.greenLight, borderRadius: "6px", fontFamily: ff.b, fontSize: "11px", color: T.green, fontWeight: 600 }}>
                  ✓ Ordered
                </div>
              ) : (
                <button
                  onClick={() => reorder(item)}
                  disabled={adding === item.id}
                  style={{
                    padding: "10px 20px",
                    background: T.wine,
                    border: "none",
                    borderRadius: "6px",
                    color: T.paper,
                    fontFamily: ff.b,
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    opacity: adding === item.id ? 0.6 : 1,
                  }}
                >
                  {adding === item.id ? "Ordering…" : `Reorder ${item.lastQty}`}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "32px", padding: "24px", background: T.cream, borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 500, color: T.ink }}>Need something else?</p>
          <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted }}>Browse the full catalog to place a custom order</p>
        </div>
        <Link href="/portal/orders" style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.paper, background: T.wine, padding: "12px 24px", borderRadius: "6px" }}>
          Full Catalog →
        </Link>
      </div>
    </>
  );
}
