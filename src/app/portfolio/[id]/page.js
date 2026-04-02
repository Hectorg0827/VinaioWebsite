"use client";

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

  useEffect(() => {
    const supabase = createClient();
    // Use the ID or the Slug to find the product
    supabase
      .from("products")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setProduct({
            ...data,
            inStock: data.in_stock ?? data.inStock,
            imageUrl: data.image_url ?? data.imageUrl,
            categories: data.categories ?? [data.category]
          });
        } else {
          // Final fallback to static if not in DB
          setProduct(PRODUCTS.find((p) => p.id === id || p.slug === id));
        }
        setLoading(false);
      });
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

  return (
    <main style={{ background: T.paper, minHeight: "100vh", paddingBottom: "100px" }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ background: T.ink, height: "60vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "0 48px 60px" }}>
        {imageUrl && (
          <img src={imageUrl} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${T.ink} 0%, transparent 100%)` }} />
        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "20px" }} />
            <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.gold, marginBottom: "12px" }}>
              {(product.categories ?? [product.category]).join(" · ")} · {product.origin}
            </p>
            <h1 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 5vw, 72px)", color: T.paper, lineHeight: 1.1 }}>
              {product.name}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "80px" }}>
        {/* Left column: Info */}
        <div>
          <Reveal>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.ink, marginBottom: "24px" }}>Product Profile</h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.deep, lineHeight: 1.8, marginBottom: "40px" }}>
              {product.description}
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", padding: "40px 0", borderTop: `1px solid ${T.cream}` }}>
              <div>
                <h4 style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "12px" }}>Origin</h4>
                <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink }}>{product.origin} / {product.region}</p>
              </div>
              <div>
                <h4 style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "12px" }}>Category</h4>
                <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink }}>{(product.categories ?? [product.category]).join(", ")}</p>
              </div>
              <div>
                <h4 style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "12px" }}>Unit</h4>
                <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink }}>{product.unit}</p>
              </div>
              <div>
                <h4 style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "12px" }}>SKU</h4>
                <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.ink }}>{product.sku}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right column: Action */}
        <aside>
          <Reveal delay={0.1}>
            <div style={{ background: T.bg, padding: "40px", borderRadius: "12px", border: `1px solid ${T.cream}` }}>
              <div style={{ marginBottom: "32px" }}>
                <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, display: "block", marginBottom: "8px" }}>Wholesale Pricing</span>
                <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.wine, lineHeight: 1.2 }}>Trade-Only Member Pricing</h3>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href="/portal/login" style={{ display: "block", textAlign: "center", fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 600, color: T.paper, background: T.wine, padding: "16px", borderRadius: "6px", textDecoration: "none" }}>
                  Log in to View Price
                </Link>
                <Link href="/contact" style={{ display: "block", textAlign: "center", fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 500, color: T.wine, border: `1px solid ${T.taupe}`, padding: "16px", borderRadius: "6px", textDecoration: "none" }}>
                  Become a Partner
                </Link>
              </div>
              
              <p style={{ marginTop: "24px", fontFamily: ff.b, fontSize: "12px", color: T.muted, textAlign: "center", lineHeight: 1.6 }}>
                Pricing for this product varies by customer and region. 
                Vinaio Imports utilizes QuickBooks as the official source for all trade pricing.
              </p>
            </div>
          </Reveal>
        </aside>
      </section>

      {/* ── navigation ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 48px" }}>
        <Link href="/portfolio" style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, textDecoration: "none" }}>
          ← Back to Portfolio
        </Link>
      </section>
    </main>
  );
}
