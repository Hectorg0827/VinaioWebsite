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
  const [syncStatus, setSyncStatus] = useState("syncing"); // "syncing" | "live" | "static"
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("selection"); // "selection" | "grid"
  const [currentPortfolio, setCurrentPortfolio] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  // Try to load live products from Supabase; fall back to static data
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .order("featured", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase fetch error:", error);
          setSyncStatus("static");
          return;
        }
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
          setSyncStatus("live");
        } else {
          setSyncStatus("static");
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
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, background: "black", color: "white", padding: "10px", fontSize: "14px", pointerEvents: "none", opacity: 0.8 }}>
        {syncStatus === "syncing" && <span style={{ color: T.gold }}>◈ Syncing Live Catalog...</span>}
        {syncStatus === "live" && <span style={{ color: T.green }}>● Live Database Connected</span>}
        {syncStatus === "static" && <span style={{ color: T.wineGlow }}>○ Using Static Fallback</span>}
        <span style={{ marginLeft: "15px", opacity: 0.5 }}>Clicks: {clickCount} | {debugLog}</span>
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
                  <ProductCard product={{ ...p, onImageClick: setSelectedImage }} />
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
      {/* ── Lightbox Modal ── */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 10000, 
            display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", cursor: "zoom-out" 
          }}
        >
          <img src={selectedImage} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} alt="Enlarged product" />
          <button style={{ position: "absolute", top: "40px", right: "40px", background: "none", border: "none", color: "white", fontSize: "32px", cursor: "pointer" }}>✕</button>
        </div>
      )}
    </>
  );
}

// ─── Featured card ────────────────────────────────────────────────────────────
function FeaturedCard({ product }) {
  const logo = product.logoUrl || product.logo_url;
  const bottle = product.imageUrl || product.image_url;
  const description = product.description_en || product.description || "";
  const categories = (product.categories ?? [product.category]).join(" · ");
  
  // Truncate description
  const summary = description.length > 80 ? description.substring(0, 77) + "..." : description;

  return (
    <div style={{ padding: "32px 28px", background: T.ink, borderRadius: "10px", position: "relative", overflow: "hidden", minHeight: "360px", display: "flex", flexDirection: "column" }}>
      {bottle && (
        <img src={bottle} alt={product.name} style={{ position: "absolute", right: "-10%", top: "20%", height: "80%", objectFit: "contain", opacity: 0.2, pointerEvents: "none" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 20%, ${T.wineDeep}40 0%, transparent 70%)` }} />
      
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", gap: "20px" }}>
        {/* LOGO */}
        <div style={{ height: "60px", display: "flex", alignItems: "center" }}>
          {logo ? (
            <img src={logo} alt={product.brand} style={{ maxHeight: "100%", maxWidth: "150px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          ) : (
            <span style={{ fontFamily: ff.h, color: T.gold, fontSize: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>{product.brand}</span>
          )}
        </div>

        <div>
          <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.gold, display: "block", marginBottom: "8px" }}>
            {categories} · {product.origin}
          </span>
          <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "4px", lineHeight: 1.1 }}>{product.brand}</h3>
          <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.warm, fontStyle: "italic", marginBottom: "12px" }}>{product.name}</p>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "24px", maxWidth: "80%" }}>{summary}</p>
        </div>

        <div style={{ marginTop: "auto" }}>
          <Link href={`/portfolio/${product.id || product.slug}`} style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.paper, border: `1px solid rgba(255,255,255,0.3)`, padding: "10px 24px", textDecoration: "none", display: "inline-block" }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Catalog card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const logo = product.logoUrl || product.logo_url;
  const bottle = product.imageUrl || product.image_url;
  const description = product.description_en || product.description || "";
  
  // Use the new summary field, fallback to truncated description
  const teaser = product.summary || (description.length > 120 ? description.substring(0, 117) + "..." : description);

  return (
    <div
      style={{ 
        background: T.paper, 
        border: `1px solid ${T.cream}`, 
        borderRadius: "12px", 
        display: "flex", 
        flexDirection: "column", 
        overflow: "hidden", 
        height: "100%",
        transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
        transform: isHovered ? "translateY(-4px)" : "none",
        boxShadow: isHovered ? "0 10px 30px rgba(0,0,0,0.08)" : "0 4px 12px rgba(0,0,0,0.02)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. BRAND LOGO SLOT (Top) */}
      <div style={{ height: "100px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", borderBottom: `1px solid ${T.bg}` }}>
        {logo ? (
          <img src={logo} alt={`${product.brand} logo`} style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} />
        ) : (
          <span style={{ fontFamily: ff.h, color: T.taupe, fontSize: "18px", letterSpacing: "2px", textTransform: "uppercase" }}>{product.brand}</span>
        )}
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1 }}>
        {/* 2. BRAND NAME & TYPE */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontFamily: ff.b, fontSize: "16px", fontWeight: 700, color: T.ink, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
            {product.brand}
          </h3>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.wine, fontStyle: "italic" }}>
            {product.name} {product.type ? `· ${product.type}` : ""}
          </p>
        </div>

        {/* 3. FULL BOTTLE IMAGE (Contained) */}
        <div 
          style={{ height: "240px", position: "relative", cursor: "zoom-in", margin: "0 auto", width: "100%", display: "flex", justifyContent: "center" }}
          onClick={() => product.onImageClick?.(bottle)}
        >
          {bottle ? (
            <img
              src={bottle}
              alt={product.name}
              style={{ height: "100%", maxWidth: "100%", objectFit: "contain", filter: isHovered ? "drop-shadow(0 10px 20px rgba(0,0,0,0.15))" : "none", transition: "all 0.5s" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
              <span style={{ fontSize: "10px", color: T.muted }}>No Image Available</span>
            </div>
          )}
        </div>

        {/* 4. DESCRIPTION SUMMARY */}
        <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.6, textAlign: "center", flexGrow: 1 }}>
          {teaser}
        </p>

        {/* 5. FOOTER / BUTTON */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link 
            href={`/portfolio/${product.id || product.slug}`} 
            style={{ 
              fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", 
              color: T.paper, background: T.wine, padding: "10px 32px", borderRadius: "4px",
              textDecoration: "none", fontWeight: 600
            }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
