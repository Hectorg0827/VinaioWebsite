"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTS } from "@/data/products";

export default function SpainPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .contains("portfolios", ["spain"]);
      
      if (data && data.length > 0) {
        setProducts(data.map(p => ({
          ...p,
          imageUrl: p.image_url || p.imageUrl,
          brand: p.brand || p.name.split(' ')[0]
        })));
      } else {
        // Fallback to static data
        setProducts(PRODUCTS.filter(p => p.portfolios.includes("spain")));
      }
    } catch (err) {
      setProducts(PRODUCTS.filter(p => p.portfolios.includes("spain")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: T.bg }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ 
        height: "70vh", 
        position: "relative", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        textAlign: "center",
        background: T.ink,
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
          <img 
            src="https://images.unsplash.com/photo-1543412849-fd47250680ca?auto=format&fit=crop&q=80&w=2048" 
            alt="Spain & Italy" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent, ${T.bg})` }} />
        
        <div style={{ position: "relative", zIndex: 1, padding: "0 20px" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
              <Hr w="40px" c={T.paper} />
              <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "6px", textTransform: "uppercase", color: T.paper }}>
                European Distribution
              </span>
              <Hr w="40px" c={T.paper} />
            </div>
            <h1 style={{ 
              fontFamily: ff.h, 
              fontSize: "clamp(48px, 8vw, 100px)", 
              color: T.paper, 
              lineHeight: 1, 
              marginBottom: "32px" 
            }}>
              Vinaio Spain <br /> &amp; Italy
            </h1>
            <p style={{ 
              fontFamily: ff.b, 
              fontSize: "16px", 
              color: "rgba(255,255,255,0.8)", 
              maxWidth: "600px", 
              margin: "0 auto", 
              lineHeight: 1.8 
            }}>
              Exclusive import and full-scale distribution across the Iberian and Italian peninsulas. 
              Bridging the gap between artisanal craft and global markets.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Products ────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 24px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4vw, 48px)", color: T.ink }}>
                Current Portfolio
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, maxWidth: "500px", margin: "16px auto 0" }}>
                Select brands currently distributed in Spain and Italy. More products arriving soon.
              </p>
            </div>
          </Reveal>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px", color: T.muted }}>Loading...</div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
              gap: "32px" 
            }}>
              {products.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <div style={{ 
                    background: T.paper, 
                    borderRadius: "16px", 
                    overflow: "hidden", 
                    border: `1px solid ${T.cream}`,
                    transition: "all 0.4s",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <div style={{ 
                      height: "360px", 
                      padding: "40px", 
                      background: "#f8f8f8", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}>
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        style={{ height: "100%", objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }} 
                      />
                    </div>
                    <div style={{ padding: "32px", textAlign: "center", flexGrow: 1 }}>
                      <span style={{ 
                        fontFamily: ff.b, 
                        fontSize: "9px", 
                        letterSpacing: "3px", 
                        textTransform: "uppercase", 
                        color: T.wine,
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "12px"
                      }}>
                        {p.origin}
                      </span>
                      <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "8px" }}>
                        {p.brand}
                      </h3>
                      <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, fontStyle: "italic", marginBottom: "20px" }}>
                        {p.name}
                      </p>
                      <Link 
                        href={`/portfolio/${p.slug || p.id}`}
                        style={{ 
                          display: "inline-block",
                          fontFamily: ff.b, 
                          fontSize: "10px", 
                          letterSpacing: "2px", 
                          textTransform: "uppercase", 
                          color: T.ink,
                          border: `1px solid ${T.taupe}`,
                          padding: "12px 28px",
                          textDecoration: "none"
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Partner Section ─────────────────────────────────────────────── */}
      <section style={{ padding: "100px 56px", background: T.paper }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ margin: "0 auto 24px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "36px", color: T.ink, marginBottom: "24px" }}>
              Interested in our European reach?
            </h2>
            <p style={{ 
              fontFamily: ff.b, 
              fontSize: "16px", 
              color: T.muted, 
              lineHeight: 1.8, 
              marginBottom: "40px" 
            }}>
              Vinaio is expanding its footprint across Europe. If you are a producer looking 
              for distribution in Spain or Italy, or a retailer interested in our brands, 
              we invite you to connect with our international team.
            </p>
            <Link 
              href="/contact" 
              style={{ 
                display: "inline-block",
                fontFamily: ff.b, 
                fontSize: "11px", 
                letterSpacing: "4px", 
                textTransform: "uppercase", 
                background: T.wine, 
                color: "white", 
                padding: "20px 48px",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Contact Global Team
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
