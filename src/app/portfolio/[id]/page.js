"use client";
// NOTE: SEO metadata is handled by src/app/portfolio/[id]/layout.js (server component)

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTS } from "@/data/products"; // Fallback static data if needed
import { T, ff } from "@/lib/theme";
import Reveal from "@/components/Reveal";
import Hr from "@/components/Hr";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [brandProducts, setBrandProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    
    async function loadData() {
      // 1. Fetch main product
      const { data: p, error } = await supabase
        .from("products")
        .select("*")
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();

      let currentProduct = null;

      if (p) {
        currentProduct = {
          ...p,
          inStock: p.in_stock ?? p.inStock,
          imageUrl: p.image_url ?? p.imageUrl,
          logoUrl: p.logo_url ?? p.logoUrl,
          categories: p.categories ?? [p.category]
        };
        setProduct(currentProduct);
      } else {
        // Fallback to static if not in DB
        currentProduct = PRODUCTS.find((p) => p.id === id || p.slug === id);
        setProduct(currentProduct);
      }

      setLoading(false);

      if (currentProduct) {
        // 2. Fetch other products from the same brand
        const { data: brandData } = await supabase
          .from("products")
          .select("*")
          .eq("brand", currentProduct.brand)
          .neq("id", currentProduct.id)
          .limit(4);

        if (brandData) setBrandProducts(brandData.map(b => ({ ...b, imageUrl: b.image_url, logoUrl: b.logo_url })));

        // 3. Fetch similar products (same category)
        // If categories is an array, we use cs (contains)
        const { data: catData } = await supabase
          .from("products")
          .select("*")
          .contains("categories", currentProduct.categories || [])
          .neq("id", currentProduct.id)
          .limit(4);

        if (catData) setSimilarProducts(catData.map(s => ({ ...s, imageUrl: s.image_url, logoUrl: s.logo_url })));
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <main style={{ height: "100vh", background: T.bg, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontFamily: ff.b, color: T.muted }}>Loading product profile...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ height: "100vh", background: T.bg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Product Not Found</h1>
        <Link href="/portfolio" style={{ marginTop: "20px", color: T.wine, fontFamily: ff.b }}>Back to Portfolio</Link>
      </main>
    );
  }

  const imageUrl = product.imageUrl || product.image_url;
  const logoUrl  = product.logoUrl || product.logo_url;

  return (
    <main style={{ background: T.paper, minHeight: "100vh", paddingBottom: "100px" }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ 
        background: T.metal, 
        padding: "160px 48px 100px", 
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 70%)` }} />
        {logoUrl && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${logoUrl}')`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain", opacity: 0.1, transform: "scale(1.4)", mixBlendMode: "multiply", filter: "grayscale(100%)", pointerEvents: "none" }} />
        )}
        
        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal>
            {/* 1. BRAND NAME & TYPE */}
            <h1 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 5vw, 64px)", color: T.ink, lineHeight: 1.1, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px", position: "relative", zIndex: 1 }}>
              {product.brand}
            </h1>
            <p style={{ fontFamily: ff.b, fontSize: "20px", color: T.wine, fontStyle: "italic", fontWeight: 500, marginBottom: "16px", position: "relative", zIndex: 1 }}>
              {product.name} {product.type ? `· ${product.type}` : ""}
            </p>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px", position: "relative", zIndex: 1 }}>
              <span style={{ 
                padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontFamily: ff.b, fontWeight: 700, letterSpacing: "1px",
                background: product.inStock ? "#E6F4EA" : "#FCE8E6", color: product.inStock ? "#1E8E3E" : "#D93025", border: "1px solid currentColor"
              }}>
                {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
              </span>
              {product.featured && (
                <span style={{ 
                  padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontFamily: ff.b, fontWeight: 700, letterSpacing: "1px",
                  background: "#FEF7E0", color: "#B05E27", border: "1px solid currentColor"
                }}>
                  FEATURED SELECTION
                </span>
              )}
            </div>

            {product.summary && (
              <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "800px", margin: "0 auto", lineHeight: 1.6, fontWeight: 400, position: "relative", zIndex: 1 }}>
                {product.summary}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── Detailed Profile ────────────────────────────────────────────── */}
      <section style={{ maxWidth: "1200px", margin: "80px auto", padding: "0 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
          
          {/* LEFT: Full Bottle Image */}
          <Reveal>
            <div style={{ background: "white", borderRadius: "20px", padding: "60px", border: `1px solid ${T.cream}`, display: "flex", justifyContent: "center" }}>
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.name} 
                  style={{ maxHeight: "600px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }} 
                />
              ) : (
                <div style={{ height: "400px", width: "100%", background: T.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: T.muted }}>No Image</div>
              )}
            </div>
          </Reveal>

          {/* RIGHT: Product Details */}
          <div>
            <Reveal delay={0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <Hr w="40px" c={T.wine} />
                <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, lineHeight: 1.1 }}>{product.brand}</h2>
              </div>
              <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.wine, fontStyle: "italic", fontWeight: 500, marginBottom: "32px", marginLeft: "52px" }}>
                {product.type || (product.categories && product.categories[0]) || "Wine"}
              </p>
              
              <p style={{ fontFamily: ff.b, fontSize: "17px", color: T.deep, lineHeight: 1.8, marginBottom: "40px" }}>
                {product.description_en || product.description}
              </p>

              {/* Technical Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", padding: "40px 0", borderTop: `1px solid ${T.cream}` }}>
                <div>
                  <h4 style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>Producer</h4>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink, fontWeight: 600 }}>{product.producer || product.brand}</p>
                </div>
                <div>
                  <h4 style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>Brand Name</h4>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink, fontWeight: 600 }}>{product.brand}</p>
                </div>
                <div>
                  <h4 style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>Varietal or Style</h4>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink, fontWeight: 600 }}>{product.type || (product.categories || []).join(", ")}</p>
                </div>
                <div>
                  <h4 style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>Format</h4>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink, fontWeight: 600 }}>{product.format || product.unit}</p>
                </div>
                <div>
                  <h4 style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>Tags</h4>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink, fontWeight: 600, textTransform: "capitalize" }}>{(product.tags || []).join(", ") || "N/A"}</p>
                </div>
              </div>

              {/* Portal CTA */}
              <div style={{ marginTop: "40px", padding: "32px", background: T.bg, borderRadius: "12px", border: `1px solid ${T.cream}` }}>
                <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "16px" }}>Member Benefits</p>
                <div style={{ display: "flex", gap: "16px" }}>
                  <Link href="/portal/login" style={{ flex: 1, textAlign: "center", background: T.wine, color: "white", padding: "14px", borderRadius: "6px", textDecoration: "none", fontSize: "11px", fontWeight: 700, letterSpacing: "2px" }}>LOGIN FOR PRICE</Link>
                  <Link href="/contact" style={{ flex: 1, textAlign: "center", border: `1px solid ${T.wine}`, color: T.wine, padding: "14px", borderRadius: "6px", textDecoration: "none", fontSize: "11px", fontWeight: 700, letterSpacing: "2px" }}>BECOME A PARTNER</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Suggestions Sections ────────────────────────────────────────── */}
      {(brandProducts.length > 0 || similarProducts.length > 0) && (
        <section style={{ borderTop: `1px solid ${T.cream}`, marginTop: "60px", padding: "80px 48px", background: T.bg }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Same Brand */}
            {brandProducts.length > 0 && (
              <div style={{ marginBottom: "80px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "40px" }}>
                  <h3 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>More from {product.brand}</h3>
                  <Link href="/portfolio" style={{ fontFamily: ff.b, fontSize: "11px", color: T.wine, letterSpacing: "2px" }}>VIEW ALL PRODUCERS →</Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
                  {brandProducts.map(p => <SuggestionCard key={p.id} product={p} />)}
                </div>
              </div>
            )}

            {/* Same Category */}
            {similarProducts.length > 0 && (
              <div>
                <div style={{ marginBottom: "40px" }}>
                  <h3 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>You Might Also Like</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>Other curated {(product.categories || [])[0]} selections</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
                  {similarProducts.map(p => <SuggestionCard key={p.id} product={p} />)}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ── navigation ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 48px" }}>
        <Link href="/portfolio" style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, textDecoration: "none" }}>
          ← Back to Portfolio
        </Link>
      </section>
    </main>
  );
}

function SuggestionCard({ product }) {
  const bottle = product.imageUrl || product.image_url;
  const logo   = product.logoUrl || product.logo_url;
  
  return (
    <Link href={`/portfolio/${product.id || product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ 
        background: T.paper, 
        border: `1px solid ${T.cream}`, 
        borderRadius: "12px", 
        padding: "24px", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        textAlign: "center", 
        transition: "transform 0.3s",
        overflow: "hidden"
      }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
        <div style={{ height: "180px", marginBottom: "20px" }}>
           {bottle && <img src={bottle} style={{ height: "100%", objectFit: "contain" }} />}
        </div>
        <h4 style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 700, color: T.ink, marginBottom: "4px" }}>{product.name}</h4>
        <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.wine, fontStyle: "italic" }}>{product.type}</p>
      </div>
    </Link>
  );
}
