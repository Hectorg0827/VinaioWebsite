"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Badge from "@/components/Badge";
import { PRODUCTS, ACTIVE_CATEGORIES } from "@/data/products";
import { createClient } from "@/lib/supabase/client";
import PortalShell from "@/components/PortalShell";

export default function OrdersPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => {
      if (data?.length) setProducts(data.map((p) => ({ ...p, inStock: p.in_stock })));
    });
  }, []);

  const filtered = products.filter(
    (p) =>
      (catFilter === "All" || (p.categories ?? [p.category]).includes(catFilter)) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product, qty) =>
    setCart((c) => {
      const ex = c.find((i) => (i.id || i.slug) === (product.id || product.slug));
      if (ex) return c.map((i) => (i.id || i.slug) === (product.id || product.slug) ? { ...i, qty: i.qty + qty } : i);
      return [...c, { ...product, qty }];
    });

  const removeFromCart = (id) => setCart(c => c.filter(i => (i.id || i.slug) !== id));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartQty   = cart.reduce((s, i) => s + i.qty, 0);

  const submitOrder = async () => {
    if (!cart.length) return;
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/portal/orders/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ cart, total: cartTotal, notes }),
      });

      if (res.ok) {
        setCart([]);
        setSubmitted(true);
      } else {
        alert("Failed to submit order. Please contact our trade desk.");
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <PortalShell title="Order Submitted">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🥂</div>
          <h2 style={{ fontFamily: ff.h, fontSize: "40px", color: T.ink, marginBottom: "16px" }}>Order Received</h2>
          <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "500px", lineHeight: 1.6, marginBottom: "32px" }}>
            Thank you for your order! We've sent a detailed transcript to our fulfillment team. 
            You'll receive a confirmation email once it's processed in our system.
          </p>
          <button onClick={() => setSubmitted(false)} style={{ fontFamily: ff.b, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: T.paper, background: T.wine, border: "none", borderRadius: "8px", padding: "16px 32px", cursor: "pointer", fontWeight: 700 }}>
            Place Another Order
          </button>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="Place New Order">
      <div style={{ display: "flex", gap: "40px" }}>
        
        {/* Product Browser */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Catalog Browser</h1>
            <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>Browse products and build your restock order.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by bottle name, grape, or SKU..."
              style={{ flex: 1, padding: "14px 16px", background: "white", border: `1px solid ${T.cream}`, borderRadius: "8px", fontFamily: ff.b, fontSize: "14px", outline: "none" }}
            />
            <select 
              value={catFilter} 
              onChange={e => setCatFilter(e.target.value)}
              style={{ padding: "0 16px", borderRadius: "8px", border: `1px solid ${T.cream}`, fontFamily: ff.b, fontSize: "13px", outline: "none", background: "white" }}
            >
              {["All", ...ACTIVE_CATEGORIES].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {filtered.map((p) => (
              <ProductOrderCard
                key={p.id || p.slug}
                product={p}
                addToCart={addToCart}
                cartItem={cart.find((c) => (c.id || c.slug) === (p.id || p.slug))}
              />
            ))}
          </div>
        </div>

        {/* Floating Cart Panel */}
        <div style={{ width: "380px", flexShrink: 0 }}>
          <div style={{ position: "sticky", top: "40px", background: "white", borderRadius: "16px", border: `1px solid ${T.cream}`, padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontFamily: ff.h, fontSize: "20px", color: T.ink, marginBottom: "24px", display: "flex", justifyContent: "space-between" }}>
              Your Order <span>({cartQty})</span>
            </h3>

            {cart.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: T.muted }}>
                <p style={{ fontSize: "14px" }}>Your order is currently empty.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px", maxHeight: "400px", overflowY: "auto", paddingRight: "8px" }}>
                  {cart.map(item => (
                    <div key={item.id || item.slug} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: T.ink }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: T.muted }}>{item.qty} × ${item.price.toFixed(2)}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.id || item.slug)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "14px", opacity: 0.5 }}>×</button>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: `1px solid ${T.cream}`, paddingTop: "20px", marginBottom: "24px" }}>
                   <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: T.muted, display: "block", marginBottom: "8px" }}>Order Notes / Special Requests</label>
                   <textarea 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Delivery instructions, etc..."
                    style={{ width: "100%", height: "80px", padding: "12px", borderRadius: "8px", border: `1px solid ${T.cream}`, fontSize: "13px", fontFamily: ff.b, resize: "none", outline: "none" }}
                   />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
                  <span style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>Estimated Total</span>
                  <span style={{ fontFamily: ff.h, fontSize: "28px", color: T.wine }}>${cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={submitOrder}
                  disabled={submitting}
                  style={{ width: "100%", padding: "16px", background: T.wine, color: "white", border: "none", borderRadius: "8px", fontFamily: ff.b, fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT ORDER"}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </PortalShell>
  );
}

function ProductOrderCard({ product, addToCart, cartItem }) {
  const [qty, setQty] = useState(6);
  const fmt = (n) => `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div style={{ padding: "24px", background: "white", border: `1px solid ${T.cream}`, borderRadius: "12px", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div>
            <h4 style={{ fontFamily: ff.b, fontSize: "15px", fontWeight: 700, color: T.ink, marginBottom: "2px" }}>{product.name}</h4>
            <p style={{ fontSize: "12px", color: T.muted }}>{product.unit} | SKU: {product.sku}</p>
          </div>
          {!product.inStock && <Badge status="outofstock" />}
        </div>
        <p style={{ fontSize: "12px", color: T.muted, fontStyle: "italic" }}>{product.origin}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontFamily: ff.h, fontSize: "22px", fontWeight: 500, color: T.wine }}>{fmt(product.price)}</span>
        <span style={{ background: T.bg, padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>{product.category}</span>
      </div>

      {product.inStock ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.cream}`, borderRadius: "8px", overflow: "hidden", background: T.bg }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: "32px", height: "40px", border: "none", background: "none", cursor: "pointer", color: T.ink }}>−</button>
            <span style={{ width: "32px", textAlign: "center", fontSize: "13px", fontWeight: 600 }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: "32px", height: "40px", border: "none", background: "none", cursor: "pointer", color: T.ink }}>+</button>
          </div>
          <button
            onClick={() => addToCart(product, qty)}
            style={{ flex: 1, padding: "10px", background: cartItem ? T.green : T.ink, border: "none", borderRadius: "8px", color: "white", fontFamily: ff.b, fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px" }}
          >
            {cartItem ? `IN CART (${cartItem.qty})` : "ADD TO ORDER"}
          </button>
        </div>
      ) : (
        <div style={{ padding: "12px", background: T.cream, borderRadius: "8px", textAlign: "center", fontWeight: 600, fontSize: "11px", color: T.muted }}>
          BACKORDER ONLY
        </div>
      )}
    </div>
  );
}
