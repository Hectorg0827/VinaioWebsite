"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";
import PortalShell from "@/components/PortalShell";

export default function SalesHistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .order("invoice_date", { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  const filtered = items.filter(i => 
    i.product_name.toLowerCase().includes(search.toLowerCase()) ||
    (i.sku && i.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (n) => `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <PortalShell title="Sales History">
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Sales History</h1>
          <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>Comprehensive bottle-by-bottle purchase records.</p>
        </div>
        
        <div style={{ position: "relative", width: "300px" }}>
          <input 
            type="text" 
            placeholder="Search by bottle name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: "8px", border: `1px solid ${T.cream}`, outline: "none", fontFamily: ff.b, fontSize: "13px" }}
          />
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>🔍</span>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: `1px solid ${T.cream}`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 0.8fr 1fr 1fr", padding: "16px 24px", background: T.bg, borderBottom: `1px solid ${T.cream}`, fontFamily: ff.b, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, color: T.muted }}>
          <span>Product Details</span>
          <span>Date</span>
          <span>Qty</span>
          <span>Unit Price</span>
          <span style={{ textAlign: "right" }}>Total</span>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: T.muted }}>Loading history...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: T.muted }}>
            {search ? "No products found matching your search." : "No purchase history found."}
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 0.8fr 1fr 1fr", padding: "18px 24px", borderBottom: `1px solid ${T.cream}`, alignItems: "center", transition: "background 0.2s" }}>
              <div>
                <span style={{ display: "block", fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.ink }}>{item.product_name}</span>
                <span style={{ fontSize: "11px", color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>SKU: {item.sku || "—"}</span>
              </div>
              <div style={{ fontSize: "13px", color: T.muted }}>
                {item.invoice_date ? new Date(item.invoice_date).toLocaleDateString() : "—"}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: T.ink }}>
                {item.qty} <span style={{ fontSize: "11px", fontWeight: 400, color: T.muted }}>btl</span>
              </div>
              <div style={{ fontSize: "13px", color: T.muted }}>
                {fmt(item.unit_price)}
              </div>
              <div style={{ textAlign: "right", fontFamily: ff.b, fontSize: "15px", fontWeight: 700, color: T.ink }}>
                {fmt(item.total_price)}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: "32px", padding: "20px", background: `${T.blue}08`, borderRadius: "8px", border: `1px solid ${T.blue}15` }}>
        <p style={{ fontSize: "12px", color: T.blue, margin: 0, lineHeight: 1.5 }}>
          <strong>Note:</strong> Sales history is updated once daily from our office system. 
          Recent purchases may take up to 24 hours to appear in your portal.
        </p>
      </div>
    </PortalShell>
  );
}
