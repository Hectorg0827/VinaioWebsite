"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import Badge from "@/components/Badge";
import { PRODUCTS, ACTIVE_CATEGORIES, ORIGINS } from "@/data/products";
import { createClient } from "@/lib/supabase/client";
import SmartLink from "@/components/SmartLink";

function PortfolioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState(PRODUCTS);
  const [syncStatus, setSyncStatus] = useState("syncing"); // "syncing" | "live" | "static"
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("selection"); // "selection" | "grid"
  const [currentPortfolio, setCurrentPortfolio] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Advanced Filter States
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedOrigin, setSelectedOrigin] = useState("All Origins");
  const [selectedSize, setSelectedSize] = useState("All Sizes");
  const [selectedType, setSelectedType] = useState("All Types");

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
              // Handle JSONB or legacy strings safely
              categories: Array.isArray(p.categories) ? p.categories : (p.categories ? [p.categories] : [p.category].filter(Boolean)),
              portfolios: Array.isArray(p.portfolios) ? p.portfolios : ["all"]
            }))
          );
          setSyncStatus("live");
        } else {
          setSyncStatus("static");
        }
      });
  }, []);

  // Synchronize search state with URL parameter changes
  useEffect(() => {
    const s = searchParams.get("search") || "";
    if (s !== search) {
      setSearch(s);
    }
  }, [searchParams]);

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
      img: "/images/portfolios/portfolio_all_products_1775108733532.png",
      brands: [] 
    },
    { 
      id: "elite", 
      title: "Vinaio Elite", 
      desc: "An exclusive selection of rare vintages and premium reserves.",
      img: "/images/portfolios/elite_bg.png",
      brands: []
    },
    { 
      id: "caribbean", 
      title: "Vinaio Caribbean", 
      desc: "The heart of the islands: Authentic rums and regional spirits.",
      img: "/images/portfolios/caribbean_bg.png",
      brands: ["La Fuerza", "Kalembu", "Bermudez", "Puntacana"]
    },
    { 
      id: "beer_low_alc", 
      title: "Beer & Low Alcohol", 
      desc: "Craft brews and refreshingly crisp low-alcohol selections.",
      img: "/images/portfolios/portfolio_beer_low_alc_1775108793231.png",
      brands: []
    },
    { 
      id: "kosher", 
      title: "Kosher Selections", 
      desc: "A curated collection of certified premium kosher wines.",
      img: "/images/portfolios/portfolio_kosher_1775108815199.png",
      brands: ["Desto"]
    },
    { 
      id: "intl_wines_spirits", 
      title: "International Wines & Spirits", 
      desc: "Global excellence sourced from the world's most renowned regions.",
      img: "/images/portfolios/portfolio_intl_wines_spirits_1775108839217.png",
      brands: ["France", "Argentina"] // Matching against origin
    },
    { 
      id: "spain", 
      title: "Vinaio Spain & Italy", 
      desc: "Our dedicated European portfolio for Spain and Italy.",
      img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2048", // Dark vineyard aesthetic
      logo: "https://vinaio-bottles.b-cdn.net/logos/Vinaio%20Spain%20logo.svg",
      brands: ["Vino La Fuerza", "Cerveza República"]
    },
  ];

  const filtered = products.filter((p) => {
    const s = search.toLowerCase();
    const matchesSearch = 
      (p.name?.toLowerCase() || "").includes(s) ||
      (p.brand?.toLowerCase() || "").includes(s) ||
      (p.origin?.toLowerCase() || "").includes(s) ||
      (p.type?.toLowerCase() || "").includes(s) ||
      (p.description_en?.toLowerCase() || p.description?.toLowerCase() || "").includes(s);

    const matchesPortfolio = currentPortfolio === "all" || (p.portfolios ?? []).includes(currentPortfolio);
    const matchesCategory = category === "All" || (p.categories ?? []).includes(category);
    const matchesRegion = selectedRegion === "All Regions" || p.region === selectedRegion;
    const matchesOrigin = selectedOrigin === "All Origins" || p.origin === selectedOrigin;
    const matchesSize = selectedSize === "All Sizes" || (p.unit || p.format) === selectedSize;
    const matchesType = selectedType === "All Types" || p.type === selectedType;

    return matchesSearch && matchesPortfolio && matchesCategory && matchesRegion && matchesOrigin && matchesSize && matchesType;
  });

  const selectPortfolio = (id) => {
    setCurrentPortfolio(id);
    setViewMode("grid");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featured = products.filter((p) => p.featured);

  // Derive unique options for advanced filters dynamically from Supabase data
  const dynamicCategories = ["All", ...Array.from(new Set(products.flatMap(p => p.categories || []))).sort()];
  const uniqueOrigins = ["All Origins", ...Array.from(new Set(products.map(p => p.origin).filter(Boolean))).sort()];
  const uniqueRegions = ["All Regions", ...Array.from(new Set(products.map(p => p.region).filter(Boolean))).sort()];
  const uniqueSizes = ["All Sizes", ...Array.from(new Set(products.map(p => p.unit || p.format).filter(Boolean))).sort()];
  const uniqueTypes = ["All Types", ...Array.from(new Set(products.map(p => p.type).filter(Boolean))).sort()];

  const SkeletonCard = () => (
    <div style={{ height: "480px", background: T.paper, borderRadius: "12px", border: `1px solid ${T.cream}`, padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ height: "60px", background: T.bg, borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
      <div style={{ flexGrow: 1, background: T.bg, borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
      <div style={{ height: "40px", width: "60%", margin: "0 auto", background: T.bg, borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
      <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
    </div>
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "60vh",
          background: T.metal,
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
          <h1 style={{ fontFamily: ff.h, fontSize: "clamp(48px, 7vw, 88px)", color: T.ink, lineHeight: 0.92, marginBottom: "24px" }}>
            Curated from<br />
            <em>the world&apos;s finest</em>
          </h1>
          <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "480px", lineHeight: 1.8 }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
              {PORTFOLIO_CARDS.map((card, i) => {
                // If the total card count is odd, make the last card span all columns beautifully
                const isLastAndOdd = i === PORTFOLIO_CARDS.length - 1 && PORTFOLIO_CARDS.length % 2 !== 0;
                
                return (
                  <div key={card.id} style={{ gridColumn: isLastAndOdd ? "1 / -1" : undefined }}>
                    <Reveal delay={i * 0.1}>
                      <div 
                        className="portfolio-card"
                      style={{ 
                        width: "100%", height: "360px", position: "relative", borderRadius: "16px", 
                        overflow: "hidden", border: `1px solid ${T.cream}`, background: T.paper,
                        display: "block", zIndex: 20, transition: "all 0.4s",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                        cursor: "pointer"
                      }}
                      onClick={() => selectPortfolio(card.id)}
                    >
                      {/* Stylized background image with brand-grey match */}
                      <div style={{ position: "absolute", inset: 0, background: T.metal, zIndex: 0 }} />
                      <img 
                        src={card.img} 
                        alt={card.title} 
                        style={{ 
                          position: "absolute", inset: 0, width: "100%", height: "100%", 
                          objectFit: "cover", zIndex: 1, 
                          filter: "grayscale(100%) opacity(0.65)",
                          transition: "all 0.6s ease" 
                        }} 
                      />
                      {/* Lighter overlay for better background visibility */}
                      <div style={{ 
                        position: "absolute", inset: 0, 
                        background: `linear-gradient(135deg, rgba(72,68,64,0.4) 0%, rgba(26,24,21,0.7) 100%)`, 
                        zIndex: 2 
                      }} />
                      
                      {/* Product bottle overlays - USING REAL CATALOG IMAGES */}
                      {(() => {
                        const bottleShots = card.brands.map(bName => {
                          const prod = products.find(p => {
                            const brand = (p.brand || "").toLowerCase();
                            const producer = (p.producer || "").toLowerCase();
                            const target = bName.toLowerCase();
                            return brand.includes(target) || producer.includes(target);
                          });
                          
                          if (!prod) return null;
                          
                          // Prioritize image_url, then construct Bunny.net URL from image_file
                          let url = prod.imageUrl || prod.image_url;
                          if (!url && prod.image_file && !prod.image_file.includes('placeholder.png')) {
                            url = `https://vinaio-bottles.b-cdn.net/${encodeURI(prod.image_file)}`;
                          }
                          
                          return url || null;
                        }).filter(Boolean);

                        return (
                          <div style={{ 
                            position: "absolute", top: "5%", right: "8%", bottom: "5%", left: "40%", 
                            display: "flex", alignItems: "flex-end", justifyContent: "flex-end", 
                            gap: "-45px", zIndex: 4, pointerEvents: "none"
                          }}>
                            {bottleShots.map((shot, idx) => {
                              const total = bottleShots.length;
                              // Stagger height: Middle ones taller
                              const isMiddle = idx > 0 && idx < total - 1;
                              const height = total > 3 ? (isMiddle ? "95%" : "80%") : (idx === 1 ? "100%" : "85%");
                              const rotation = total > 3 ? (idx - (total-1)/2) * 4 : (idx === 0 ? -6 : idx === 2 ? 6 : 0);
                              const translateY = isMiddle ? -12 : 0;

                              return (
                                <img 
                                  key={idx} 
                                  src={shot} 
                                  alt="authentic product" 
                                  style={{ 
                                    height: height, 
                                    objectFit: "contain",
                                    marginRight: total > 3 ? "-80px" : "-70px",
                                    filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.6))",
                                    transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                                    transition: "all 0.5s ease"
                                  }} 
                                />
                              );
                            })}
                          </div>
                        );
                      })()}

                      <div style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px", zIndex: 5 }}>
                        {card.logo && (
                          <img 
                            src={card.logo} 
                            alt={card.title} 
                            style={{ 
                              height: "50px", 
                              width: "auto",
                              marginBottom: "16px", 
                              filter: "brightness(0) invert(1) drop-shadow(0 4px 6px rgba(0,0,0,0.5))" 
                            }} 
                          />
                        )}
                        <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "8px" }}>{card.title}</h3>
                        <p style={{ fontFamily: ff.b, fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: "60%", marginBottom: "16px" }}>{card.desc}</p>
                        
                        {/* Interactive Brand Tags */}
                        {card.brands && card.brands.length > 0 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {card.brands.map(b => (
                              <SmartLink key={b} text={b} style={{ borderBottom: "none" }}>
                                <span style={{ 
                                  fontSize: "9px", 
                                  fontFamily: ff.b, 
                                  fontWeight: 700,
                                  letterSpacing: "1px",
                                  textTransform: "uppercase",
                                  color: T.paper, 
                                  background: "rgba(255,255,255,0.15)", 
                                  padding: "6px 12px", 
                                  borderRadius: "4px",
                                  backdropFilter: "blur(4px)",
                                  cursor: "pointer",
                                  transition: "all 0.3s"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = T.wine; e.currentTarget.style.transform = "scale(1.05)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "scale(1)"; }}
                                >
                                  {b}
                                </span>
                              </SmartLink>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Catalog Mode ────────────────────────────────────────────────── */}
      {viewMode === "grid" && (
        <section style={{ background: T.bg, padding: "80px 56px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {currentPortfolio === "elite" && (
              <Reveal>
                <div style={{
                  marginBottom: "28px",
                  padding: "20px 24px",
                  border: `1px solid ${T.gold}55`,
                  borderRadius: "12px",
                  background: "linear-gradient(120deg, rgba(26,24,21,0.96) 0%, rgba(57,42,36,0.9) 100%)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.12)"
                }}>
                  <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.gold, marginBottom: "8px" }}>
                    Elite Selection
                  </p>
                  <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, maxWidth: "760px" }}>
                    Discover limited allocations and cellar-worthy references, presented with expanded tasting notes and a refined visual profile tailored for premium buyers.
                  </p>
                </div>
              </Reveal>
            )}

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
                
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Quick search brands or products..."
                  style={{
                    padding: "14px 20px", background: T.paper, border: `1px solid ${T.cream}`,
                    borderRadius: "10px", fontFamily: ff.b, fontSize: "14px", color: T.ink,
                    outline: "none", width: "320px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                  }}
                />
              </div>

              {/* Advanced Professional Filter Bar */}
              <div style={{ 
                display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px", 
                paddingBottom: "24px", borderBottom: `1px solid ${T.cream}` 
              }}>
                 {[
                   { label: "Category", val: category, set: setCategory, options: dynamicCategories },
                   { label: "Region", val: selectedRegion, set: setSelectedRegion, options: uniqueRegions },
                   { label: "Country", val: selectedOrigin, set: setSelectedOrigin, options: uniqueOrigins },
                   { label: "Format", val: selectedSize, set: setSelectedSize, options: uniqueSizes },
                   { label: "Type", val: selectedType, set: setSelectedType, options: uniqueTypes },
                 ].map(f => (
                   <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, color: T.muted }}>{f.label}</span>
                      <select 
                        value={f.val} 
                        onChange={(e) => f.set(e.target.value)}
                        style={{
                          padding: "10px 16px", background: T.paper, color: T.ink, border: `1px solid ${T.cream}`, 
                          borderRadius: "8px", fontSize: "13px", fontFamily: ff.b, outline: "none", minWidth: "150px"
                        }}
                      >
                        {f.options.map(o => <option key={o} value={o}>{o === "All" ? `All ${f.label}s` : o}</option>)}
                      </select>
                   </div>
                 ))}
                 <button 
                  onClick={() => {
                    setCategory("All");
                    setSelectedRegion("All Regions");
                    setSelectedOrigin("All Origins");
                    setSelectedSize("All Sizes");
                    setSelectedType("All Types");
                    setSearch("");
                  }}
                  style={{ alignSelf: "flex-end", fontSize: "11px", color: T.wine, background: "none", border: "none", cursor: "pointer", height: "40px", padding: "0 10px" }}
                 >
                   Reset Filters
                 </button>
              </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {syncStatus === "syncing" ? (
                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              ) : (
                filtered.map((p, i) => (
                  <Reveal key={p.id || p.slug} delay={i * 0.05}>
                    <ProductCard product={{ ...p, onImageClick: setSelectedImage }} isEliteView={currentPortfolio === "elite"} />
                  </Reveal>
                ))
              )}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "120px 0", fontFamily: ff.b, fontSize: "15px", color: T.muted }}>
                No products found matching your active filters.
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
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
            gap: "24px",
            alignItems: "stretch"
          }}>
            {ORIGINS.map((o, i) => (
              <Reveal key={o.name} delay={i * 0.08}>
                <div style={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  background: T.bg, 
                  border: `1px solid ${T.cream}`, 
                  borderRadius: "12px", 
                  overflow: "hidden",
                  textAlign: "center"
                }}>
                  {/* High-Impact Flag Icon on top */}
                  <div style={{ padding: "40px 24px 20px" }}>
                    <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto" }}>
                      <img 
                        src={o.customIcon || `https://flagcdn.com/w160/${o.isoCode}.png`} 
                        alt={o.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: o.customIcon ? "contain" : "cover",
                          borderRadius: "50%",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                          border: `4px solid ${T.paper}`,
                          background: T.paper,
                          padding: o.customIcon ? "8px" : "0"
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Description in center */}
                  <div style={{ padding: "0 24px 80px", flexGrow: 1, display: "flex", alignItems: "center" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, lineHeight: 1.8 }}>
                      {o.description}
                    </p>
                  </div>
                  
                  {/* Burgundy strip at bottom */}
                  <div style={{ 
                    background: T.wine, 
                    padding: "16px 20px", 
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <h3 style={{ 
                      fontFamily: ff.h, 
                      fontSize: "18px", 
                      color: T.paper, 
                      margin: 0,
                      letterSpacing: "0.5px"
                    }}>
                      {o.name}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.metal,
        padding: "80px 56px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "clamp(28px, 4vw, 44px)", color: T.ink, marginBottom: "20px" }}>
            Interested in our portfolio?
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, marginBottom: "36px", maxWidth: "480px", margin: "0 auto 36px", lineHeight: 1.8 }}>
            Trade buyers and licensed importers can access wholesale pricing and place orders directly in the Customer Portal.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ fontFamily: ff.b, fontSize: "10.5px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 600, color: T.paper, background: T.wine, border: `1px solid ${T.wine}`, padding: "14px 32px" }}>
              Become a Partner
            </Link>
            <Link href="/portal" style={{ fontFamily: ff.b, fontSize: "10.5px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 500, color: T.ink, background: "transparent", border: `1px solid ${T.ink}40`, padding: "14px 32px" }}>
              Customer Portal →
            </Link>
          </div>
        </Reveal>
        </div>
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

// ─── Featured card (Consistent styling) ───
function FeaturedCard({ product }) {
  const logo = product.logoUrl || product.logo_url;
  const bottle = product.imageUrl || product.image_url;
  const description = product.description_en || product.description || "";
  const categories = (product.categories ?? [product.category]).join(" · ");
  const summary = description.length > 80 ? description.substring(0, 77) + "..." : description;

  return (
    <div style={{ padding: "32px 28px", background: T.ink, borderRadius: "10px", position: "relative", overflow: "hidden", minHeight: "360px", display: "flex", flexDirection: "column" }}>
      {bottle && <img src={bottle} alt={product.name} style={{ position: "absolute", right: "-10%", top: "20%", height: "80%", objectFit: "contain", opacity: 0.2, pointerEvents: "none" }} />}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 20%, ${T.wineDeep}40 0%, transparent 70%)` }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", gap: "20px" }}>
        <div>
          <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.gold, display: "block", marginBottom: "8px" }}>{categories} · {product.origin}</span>
          <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "4px", lineHeight: 1.1 }}>{product.brand}</h3>
          <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.warm, fontStyle: "italic", marginBottom: "12px" }}>{product.name}</p>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "24px", maxWidth: "80%" }}>{summary}</p>
        </div>
        <div style={{ marginTop: "auto" }}>
          <Link href={`/portfolio/${product.id || product.slug}`} style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.paper, border: `1px solid rgba(255,255,255,0.3)`, padding: "10px 24px", textDecoration: "none", display: "inline-block" }}>View Details</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Product card (Consistent styling) ───
function ProductCard({ product, isEliteView = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const logo = product.logoUrl || product.logo_url;
  const bottle = product.imageUrl || product.image_url;
  const description = product.description_en || product.description || "";
  const teaser = product.summary || (description.length > 120 ? description.substring(0, 117) + "..." : description);

  // Fallback if no URL or if image fails to load
  const displayBottle = (!bottle || imgError) ? "/images/placeholders/bottle_placeholder.png" : bottle;

  return (
    <div
      style={{ 
        background: isEliteView ? "linear-gradient(160deg, #12100F 0%, #1E1A17 100%)" : T.paper,
        border: isEliteView ? `1px solid ${T.gold}4A` : `1px solid ${T.cream}`,
        borderRadius: isEliteView ? "14px" : "12px", 
        display: "flex", flexDirection: "column", overflow: "hidden", height: "100%",
        transition: "all 0.4s", transform: isHovered ? "translateY(-4px)" : "none",
        boxShadow: isEliteView
          ? (isHovered ? "0 18px 40px rgba(0,0,0,0.32)" : "0 8px 20px rgba(0,0,0,0.16)")
          : (isHovered ? "0 10px 30px rgba(0,0,0,0.08)" : "0 4px 12px rgba(0,0,0,0.02)")
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1 }}>
        {isEliteView && (
          <span style={{
            alignSelf: "center",
            fontFamily: ff.b,
            fontSize: "9px",
            letterSpacing: "2.6px",
            textTransform: "uppercase",
            color: T.gold,
            border: `1px solid ${T.gold}66`,
            borderRadius: "999px",
            padding: "6px 14px"
          }}>
            Vinaio Elite
          </span>
        )}
        <div style={{ textAlign: "center" }}>
          <h3 style={{
            fontFamily: isEliteView ? ff.h : ff.b,
            fontSize: isEliteView ? "18px" : "16px",
            fontWeight: isEliteView ? 500 : 700,
            color: isEliteView ? T.paper : T.ink,
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: isEliteView ? "0.6px" : "0"
          }}>{product.brand}</h3>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: isEliteView ? T.gold : T.wine, fontStyle: "italic" }}>{product.name} {product.type ? `· ${product.type}` : ""}</p>
        </div>
        <div 
          style={{ height: "240px", cursor: "zoom-in", margin: "0 auto", width: "100%", display: "flex", justifyContent: "center" }} 
          onClick={() => product.onImageClick?.(displayBottle)}
        >
          <img 
            src={displayBottle} 
            alt={product.name} 
            onError={() => setImgError(true)}
            style={{ 
              height: "100%", 
              maxWidth: "100%", 
              objectFit: "contain", 
              transition: "all 0.5s",
              opacity: (imgError || !bottle) ? 0.3 : 1,
              filter: (imgError || !bottle) ? "grayscale(1) contrast(1.2)" : "none"
            }} 
          />
        </div>
        <p style={{
          fontFamily: ff.b,
          fontSize: "12px",
          color: isEliteView ? "rgba(255,255,255,0.66)" : T.muted,
          lineHeight: isEliteView ? 1.75 : 1.6,
          textAlign: "center",
          flexGrow: 1
        }}>{teaser}</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link href={`/portfolio/${product.id || product.slug}`} style={{
            fontFamily: ff.b,
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: isEliteView ? T.ink : T.paper,
            background: isEliteView ? `linear-gradient(90deg, ${T.gold} 0%, #c7a56d 100%)` : T.wine,
            border: isEliteView ? `1px solid ${T.gold}AA` : "none",
            padding: "10px 32px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: 600
          }}>Details</Link>
        </div>
      </div>
    </div>
  );
}


export default function PortfolioPage() {
  return (
    <Suspense fallback={<div>Loading Portfolio...</div>}>
      <PortfolioContent />
    </Suspense>
  );
}
