"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Badge from "@/components/Badge";
import { PRODUCTS, ACTIVE_CATEGORIES } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

export default function OrdersPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
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

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartQty   = cart.reduce((s, i) => s + i.qty, 0);

  const submitOrder = async () => {
    if (!cart.length) return;
    setSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSubmitting(false); return; }

    const { data: order } = await supabase
      .from("orders")
      .insert({ customer_id: user.id, status: "processing", total: cartTotal })
      .select()
      .single();

    if (order) {
      await supabase.from("order_items").insert(
        cart.map((item) => ({
          order_id:   order.id,
          product_id: item.id,
          qty:        item.qty,
          unit_price: item.price,
        }))
      );
      setCart([]);
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
        <div style={{ fontSize: "48px" }}>✓</div>
        <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.green }}>Order Submitted!</h2>
        <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>Your order is being processed. You'll receive a confirmation shortly.</p>
        <button onClick={() => setSubmitted(false)} style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.paper, background: T.wine, border: "none", borderRadius: "6px", padding: "12px 24px", cursor: "pointer" }}>
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "4px" }}>Place New Order</h2>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted }}>Browse catalog and add to your order</p>
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "16px 24px", background: T.wine, borderRadius: "8px", color: T.paper, textAlign: "right", minWidth: "200px" }}>
            <div style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Cart ({cartQty} items)</div>
            <div style={{ fontFamily: ff.h, fontSize: "24px", marginTop: "2px" }}>${cartTotal.toFixed(2)}</div>
            <button
              onClick={submitOrder}
              disabled={submitting}
              style={{ fontFamily: ff.b, fontSize: "10px", marginTop: "8px", cursor: "pointer", background: "rgba(255,255,255,0.15)", border: "none", color: T.paper, padding: "6px 12px", borderRadius: "4px", opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? "Submitting…" : "Submit Order →"}
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{ padding: "12px 16px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "6px", fontFamily: ff.b, fontSize: "13px", color: T.ink, outline: "none", width: "260px" }}
        />
        <div style={{ display: "flex", gap: "4px", background: T.cream, borderRadius: "6px", padding: "3px" }}>
          {ACTIVE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: catFilter === c ? 600 : 400, color: catFilter === c ? T.paper : T.muted, background: catFilter === c ? T.wine : "transparent", border: "none", padding: "8px 14px", borderRadius: "4px", cursor: "pointer" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filtered.map((p) => (
          <ProductOrderCard
            key={p.id || p.slug}
            product={p}
            addToCart={addToCart}
            cartItem={cart.find((c) => (c.id || c.slug) === (p.id || p.slug))}
          />
        ))}
      </div>
    </>
  );
}

function ProductOrderCard({ product, addToCart, cartItem }) {
  const [qty, setQty] = useState(6);
  return (
    <div style={{ padding: "24px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <h4 style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.ink, marginBottom: "4px" }}>{product.name}</h4>
          <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted }}>{product.sku} · {product.unit} · {product.origin}</p>
        </div>
        {!product.inStock && <Badge status="outofstock" />}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontFamily: ff.h, fontSize: "22px", fontWeight: 500, color: T.wine }}>${product.price}</span>
        <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.muted }}>{(product.categories ?? [product.category]).join(", ")}</span>
      </div>
      {product.inStock ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.cream}`, borderRadius: "6px", overflow: "hidden" }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: "36px", height: "36px", border: "none", background: T.cream, cursor: "pointer", fontSize: "16px", color: T.deep }}>−</button>
            <span style={{ width: "44px", textAlign: "center", fontFamily: ff.b, fontSize: "13px", color: T.ink }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: "36px", height: "36px", border: "none", background: T.cream, cursor: "pointer", fontSize: "16px", color: T.deep }}>+</button>
          </div>
          <button
            onClick={() => addToCart(product, qty)}
            style={{ flex: 1, padding: "10px", background: cartItem ? T.green : T.wine, border: "none", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "11px", fontWeight: 600, cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" }}
          >
            {cartItem ? `✓ In Cart (${cartItem.qty})` : "Add to Order"}
          </button>
        </div>
      ) : (
        <div style={{ padding: "10px", background: T.cream, borderRadius: "6px", textAlign: "center", fontFamily: ff.b, fontSize: "11px", color: T.muted }}>
          Out of Stock — Contact your rep
        </div>
      )}
    </div>
  );
}
