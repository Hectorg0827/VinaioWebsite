"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import Badge from "@/components/Badge";
import { PRODUCTS, ACTIVE_CATEGORIES, ORIGINS } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

export default function PortfolioPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("selection"); // "selection" | "grid"
  const [currentPortfolio, setCurrentPortfolio] = useState("all");

  // Try to load live products from Supabase; fall back to static data
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .order("featured", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(
            data.map((p) => ({
              ...p,
              inStock: p.in_stock ?? p.inStock,
              imageUrl: p.image_url ?? p.imageUrl,
              featured: p.featured,
              categories: p.categories ?? [p.category],
              portfolios: p.portfolios ?? ["all"]
            }))
          );
        }
      });
  }, []);

  const [debugLog, setDebugLog] = useState("Debug: Ready");
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleClick = (e) => {
      setClickCount((c) => c + 1);
      setDebugLog(`Last: ${e.target?.tagName}#${e.target?.id}.${e.target?.className}`);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const PORTFOLIO_CARDS = [
    { 
      id: "all", 
      title: "All Products", 
      desc: "Our complete master catalog of fine wines and spirits.",
      img: "/images/portfolios/portfolio_all_products_1775108733532.png" 
    },
    { 
      id: "elite", 
      title: "Vinaio Elite", 
      desc: "An exclusive selection of rare vintages and premium reserves.",
      img: "/images/portfolios/portfolio_elite_1775108751487.png" 
    },
    { 
      id: "caribbean", 
      title: "Vinaio Caribbean", 
      desc: "The heart of the islands: Authentic rums and regional spirits.",
      img: "/images/portfolios/portfolio_caribbean_1775108770795.png" 
    },
    { 
      id: "beer_low_alc", 
      title: "Beer & Low Alcohol", 
      desc: "Craft brews and refreshingly crisp low-alcohol selections.",
      img: "/images/portfolios/portfolio_beer_low_alc_1775108793231.png" 
    },
    { 
      id: "kosher", 
      title: "Kosher Selections", 
      desc: "A curated collection of certified premium kosher wines.",
      img: "/images/portfolios/portfolio_kosher_1775108815199.png" 
    },
    { 
      id: "intl_wines_spirits", 
      title: "International Wines & Spirits", 
      desc: "Global excellence sourced from the world's most renowned regions.",
      img: "/images/portfolios/portfolio_intl_wines_spirits_1775108839217.png" 
    },
  ];

  const filtered = products.filter(
    (p) =>
      (currentPortfolio === "all" || (p.portfolios ?? []).includes(currentPortfolio)) &&
      (category === "All" || (p.categories ?? []).includes(category)) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
        p.origin.toLowerCase().includes(search.toLowerCase()) ||
        (p.description_en || p.description || "").toLowerCase().includes(search.toLowerCase()))
  );

  const selectPortfolio = (id) => {
    console.log("Selecting portfolio:", id);
    setCurrentPortfolio(id);
    setViewMode("grid");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featured = products.filter((p) => p.featured);

  return (
    <>
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, background: "black", color: "white", padding: "10px", fontSize: "14px", pointerEvents: "none" }}>
        Clicks: {clickCount} | {debugLog}
      </div>
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

      {/* ── Portfolio Selection Mode ────────────────────────────────────── */}
      {viewMode === "selection" && (
        <section style={{ background: T.bg, padding: "80px 56px", position: "relative", zIndex: 10 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <Hr w="40px" c={T.wine} style={{ margin: "0 auto 24px" }} />
                <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 5vw, 48px)", color: T.ink }}>Explore Our Collections</h2>
                <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "600px", margin: "16px auto 0" }}>
                  Select a specialized portfolio to view our curated brands and products.
                </p>
              </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
              {PORTFOLIO_CARDS.map((card, i) => (
                <Reveal key={card.id} delay={i * 0.1}>
                  <div 
                    style={{ 
                      width: "100%",
                      height: "320px", 
                      position: "relative", 
                      borderRadius: "16px", 
                      overflow: "hidden", 
                      border: `1px solid ${T.cream}`,
                      background: T.paper,
                      display: "block",
                      zIndex: 20,
                      transition: "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
                    }}
                  >
                    <img src={card.img} alt={card.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${T.ink} 0%, transparent 60%)`, zIndex: 1 }} />
                    <div style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px", zIndex: 2 }}>
                      <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "8px" }}>{card.title}</h3>
                      <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{card.desc}</p>
                    </div>
                    {/* Transparent overlay dedicated strictly to catching clicks */}
                    <button
                      onClick={() => selectPortfolio(card.id)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        zIndex: 10,
                        padding: 0,
                        outline: "none"
                      }}
                      aria-label={`Select ${card.title}`}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Catalog Mode ────────────────────────────────────────────────── */}
      {viewMode === "grid" && (
        <section style={{ background: T.bg, padding: "80px 56px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
                <div>
                  <button 
                    onClick={() => setViewMode("selection")}
                    style={{ background: "none", border: "none", color: T.wine, fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}
                  >
                    ← Back to Portfolios
                  </button>
                  <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink }}>
                    {PORTFOLIO_CARDS.find(c => c.id === currentPortfolio)?.title}
                  </h2>
                </div>
                
                {/* Search + filter */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search this collection..."
                    style={{
                      padding: "14px 20px",
                      background: T.paper,
                      border: `1px solid ${T.cream}`,
                      borderRadius: "10px",
                      fontFamily: ff.b,
                      fontSize: "14px",
                      color: T.ink,
                      outline: "none",
                      width: "280px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                    }}
                  />
                </div>
              </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {filtered.map((p, i) => (
                <Reveal key={p.id || p.slug} delay={i * 0.05}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "120px 0", fontFamily: ff.b, fontSize: "15px", color: T.muted }}>
                No products found in this collection.
              </div>
            )}
          </div>
        </section>
      )}

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
  const imageUrl = product.imageUrl || product.image_url;
  return (
    <div style={{ padding: "32px 28px", background: T.ink, borderRadius: "10px", position: "relative", overflow: "hidden", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      {imageUrl && (
        <img src={imageUrl} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 80% 20%, ${T.wineDeep}60 0%, transparent 60%)` }} />
      <div style={{ position: "relative" }}>
        <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.gold, display: "block", marginBottom: "8px" }}>{(product.categories ?? [product.category]).join(" · ")} · {product.origin}</span>
        <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "8px", lineHeight: 1.2 }}>{product.name}</h3>
        <p style={{ fontFamily: ff.b, fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "20px" }}>{product.description_en || product.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: T.gold, opacity: 0.8 }}>Wholesale Pricing in Portal</span>
          <Link href="/portal" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.paper, border: `1px solid rgba(255,255,255,0.2)`, padding: "8px 16px" }}>
            View Details
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
      style={{ background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.taupe)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.cream)}
    >
      {(product.imageUrl || product.image_url) && (
        <Link href={`/portfolio/${product.id}`} style={{ height: "180px", overflow: "hidden", display: "block" }}>
          <img
            src={product.imageUrl || product.image_url}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>
      )}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.wine, background: T.wineGlow, padding: "4px 10px", borderRadius: "4px" }}>
            {(product.categories ?? [product.category]).join(" · ")}
          </span>
          {!product.inStock && <Badge status="outofstock" />}
        </div>
        <div>
          <Link href={`/portfolio/${product.id}`} style={{ textDecoration: "none" }}>
            <h3 style={{ fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink, marginBottom: "4px" }}>{product.name}</h3>
          </Link>
          <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted }}>{product.sku} · {product.unit} · {product.origin}</p>
        </div>
        <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.deep, lineHeight: 1.7, flexGrow: 1 }}>{product.description_en || product.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: `1px solid ${T.cream}`, marginTop: "auto" }}>
          <span style={{ fontFamily: ff.b, fontSize: "10px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Wholesale pricing in portal</span>
          <Link href={`/portfolio/${product.id || product.slug}`} style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.paper, background: T.wine, padding: "8px 16px", borderRadius: "4px" }}>
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
