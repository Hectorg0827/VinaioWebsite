"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import Badge from "@/components/Badge";
import { PRODUCTS, CATEGORIES, ORIGINS } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

export default function PortfolioPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Try to load live products from Supabase; fall back to static data
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .order("featured", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Normalize snake_case DB fields to camelCase
          setProducts(
            data.map((p) => ({
              ...p,
              inStock: p.in_stock,
              featured: p.featured,
            }))
          );
        }
      });
  }, []);

  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.origin.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase()))
  );

  const featured = products.filter((p) => p.featured);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "60vh",
          background: T.ink,
          display: "flex",
          alignItems: "flex-end",
          padding: "140px 56px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 80% at 30% 60%, ${T.wineDeep}45 0%, transparent 55%)`,
          }}
        />
        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
          <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold, marginBottom: "16px" }}>
            Our Portfolio
          </p>
          <h1 style={{ fontFamily: ff.h, fontSize: "clamp(48px, 7vw, 88px)", color: T.paper, lineHeight: 0.92, marginBottom: "24px" }}>
            Curated from<br />
            <em>the world&apos;s finest</em>
          </h1>
          <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.8 }}>
            From aged Dominican rums to old-vine Spanish Garnacha — wines, spirits, and beers
            selected for quality, character, and market performance.
          </p>
        </div>
      </section>

      {/* ── Featured ──────────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section style={{ background: T.paper, padding: "80px 56px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
                <Hr w="32px" c={T.wine} />
                <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Featured Selections</h2>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <FeaturedCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Catalog ───────────────────────────────────────────────────────── */}
      <section style={{ background: T.bg, padding: "80px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Full Catalog</h2>
              {/* Search + filter */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  style={{
                    padding: "11px 16px",
                    background: T.paper,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "6px",
                    fontFamily: ff.b,
                    fontSize: "13px",
                    color: T.ink,
                    outline: "none",
                    width: "220px",
                  }}
                />
                <div style={{ display: "flex", gap: "4px", background: T.cream, borderRadius: "6px", padding: "3px" }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      style={{
                        fontFamily: ff.b,
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        fontWeight: category === c ? 600 : 400,
                        color: category === c ? T.paper : T.muted,
                        background: category === c ? T.wine : "transparent",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map((p, i) => (
              <Reveal key={p.id || p.slug} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", fontFamily: ff.b, fontSize: "14px", color: T.muted }}>
              No products match your search.
            </div>
          )}
        </div>
      </section>

      {/* ── Origins ───────────────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "80px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 20px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(28px, 4vw, 42px)", color: T.ink }}>
                Sourced from the World&apos;s Best
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {ORIGINS.map((o, i) => (
              <Reveal key={o.name} delay={i * 0.08}>
                <div style={{ padding: "28px 24px", background: T.bg, border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{o.flag}</div>
                  <h3 style={{ fontFamily: ff.b, fontSize: "13px", fontWeight: 600, color: T.ink, marginBottom: "8px" }}>{o.name}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.7 }}>{o.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ background: T.ink, padding: "80px 56px", textAlign: "center" }}>
        <Reveal>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "clamp(28px, 4vw, 44px)", color: T.paper, marginBottom: "20px" }}>
            Interested in our portfolio?
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "36px", maxWidth: "480px", margin: "0 auto 36px", lineHeight: 1.8 }}>
            Trade buyers and licensed importers can access wholesale pricing and place orders directly in the Customer Portal.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ fontFamily: ff.b, fontSize: "10.5px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 600, color: T.paper, background: T.wine, border: `1px solid ${T.wine}`, padding: "14px 32px" }}>
              Become a Partner
            </Link>
            <Link href="/portal" style={{ fontFamily: ff.b, fontSize: "10.5px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 500, color: T.gold, background: "transparent", border: `1px solid ${T.gold}40`, padding: "14px 32px" }}>
              Customer Portal →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────
function FeaturedCard({ product }) {
  const slug = product.id || product.slug;
  return (
    <div style={{ padding: "32px 28px", background: T.ink, borderRadius: "10px", position: "relative", overflow: "hidden", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 80% 20%, ${T.wineDeep}60 0%, transparent 60%)` }} />
      <div style={{ position: "relative" }}>
        <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.gold, display: "block", marginBottom: "8px" }}>{product.category} · {product.origin}</span>
        <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "8px", lineHeight: 1.2 }}>{product.name}</h3>
        <p style={{ fontFamily: ff.b, fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "20px" }}>{product.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: ff.h, fontSize: "22px", color: T.gold }}>${product.price}</span>
          <Link href="/contact" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.paper, border: `1px solid rgba(255,255,255,0.2)`, padding: "8px 16px" }}>
            Inquire
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Catalog card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  return (
    <div
      style={{ padding: "24px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.taupe)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.cream)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.wine, background: T.wineGlow, padding: "4px 10px", borderRadius: "4px" }}>
          {product.category}
        </span>
        {!product.inStock && <Badge status="outofstock" />}
      </div>
      <div>
        <h3 style={{ fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink, marginBottom: "4px" }}>{product.name}</h3>
        <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted }}>{product.sku} · {product.unit} · {product.origin}</p>
      </div>
      <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.deep, lineHeight: 1.7, flexGrow: 1 }}>{product.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: `1px solid ${T.cream}` }}>
        <span style={{ fontFamily: ff.h, fontSize: "20px", color: T.wine }}>${product.price}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/contact" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.muted, border: `1px solid ${T.taupe}`, padding: "7px 14px", borderRadius: "4px" }}>
            Inquire
          </Link>
          <Link href="/portal/orders" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.paper, background: T.wine, padding: "7px 14px", borderRadius: "4px" }}>
            Order
          </Link>
        </div>
      </div>
    </div>
  );
}
