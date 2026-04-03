"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";

// Fallback branding logos if DB is empty
const FALLBACK_LOGOS = [
  "brand-1.png", "brand-10.png", "brand-11.png", "brand-12.svg", "brand-13.png", 
  "brand-14.png", "brand-15.png", "brand-16.png", "brand-17.png", "brand-18.png"
];

export default function HomePage() {
  const supabase = createClient();
  const [hero, setHero] = useState({ 
    images: [], 
    subtitle: "From the sun-drenched vineyards of Rioja to the Caribbean shores of the Dominican Republic — Vinaio Imports brings the world's most compelling wines and craft beverages to the American table. Partnering directly with artisan producers in over 15 countries, we curate a portfolio of labels that tell a story in every bottle."
  });

  // Default elegant images from Unsplash to ensure background is NEVER black
  const DEFAULT_SLIDES = [
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=2000", // Vineyard/Wine
    "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=2000", // Barrels
    "https://images.unsplash.com/photo-1543412849-fd47250680ca?auto=format&fit=crop&q=80&w=2000"  // Bottles/Beach vibe
  ];

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    fetchContent();
  }, []);

  // Simple slide timer for the "alive" effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % DEFAULT_SLIDES.length);
    }, 8000); 
    return () => clearInterval(timer);
  }, []);

  const fetchContent = async () => {
    try {
      const { data: heroData } = await supabase
        .from("site_hero")
        .select("*")
        .eq("active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      
      if (heroData) {
        let urls = [];
        try {
          urls = JSON.parse(heroData.url);
        } catch (e) {
          urls = heroData.url?.split("|").filter(Boolean);
        }
        setHero({ ...heroData, images: (urls && urls.length > 0) ? urls : [heroData.url] });
      }

      const { data: partnersData } = await supabase
        .from("site_partners")
        .select("*")
        .eq("active", true)
        .order("order", { ascending: true });
      
      if (partnersData && partnersData.length > 0) {
        setPartners(partnersData.map(p => p.logo_url));
      } else {
        setPartners(FALLBACK_LOGOS.map(l => `/logos/${l}`));
      }
    } catch (err) {
      console.warn("Using default hero configuration.");
      setPartners(FALLBACK_LOGOS.map(l => `/logos/${l}`));
    }
  };

  const slides = (hero.images && hero.images.length > 0) ? hero.images : DEFAULT_SLIDES;

  return (
    <>
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
          background-size: cover;
          background-position: center;
        }
        .hero-slide.active {
          opacity: 1;
        }
        .hero-slide.active img {
          animation: kenburns 15s forwards ease-out;
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {slides.map((url, idx) => (
          <div 
            key={idx}
            className={`hero-slide ${idx === currentSlide ? "active" : ""}`}
            style={{ zIndex: 1 }}
          >
            <img 
              src={url} 
              alt="Hero Slide" 
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} 
            />
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, #000 0%, transparent 30%, transparent 70%, #000 100%)`,
            zIndex: 2
          }}
        />

        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 10vw",
            zIndex: 10
          }}
        >
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transition: "all 1s ease 0.2s",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Hr w="40px" c={T.gold} />
            <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "6px", textTransform: "uppercase", color: T.gold }}>
              Importers &amp; Distributors
            </span>
            <Hr w="40px" c={T.gold} />
          </div>

          <div style={{ opacity: loaded ? 1 : 0, transition: "all 1s ease 0.3s", marginBottom: "40px" }}>
            <img src="/logo.png" alt="Vinaio" style={{ height: "45px", width: "auto" }} />
          </div>

          <p
            style={{
              fontFamily: ff.h,
              fontSize: "clamp(18px, 1.6vw, 24px)",
              color: T.paper,
              opacity: loaded ? 1 : 0,
              transition: "all 1s ease 0.4s",
              marginBottom: "56px",
              textShadow: "0 2px 20px rgba(0,0,0,1)",
              maxWidth: "900px",
              lineHeight: 1.8,
              fontWeight: 400,
              letterSpacing: "0.5px"
            }}
          >
            {hero.subtitle}
          </p>

          <div
            style={{
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
              justifyContent: "center",
              opacity: loaded ? 1 : 0,
              transition: "all 1s ease 0.6s",
            }}
          >
            {[
              { href: "/portfolio", label: "Explore Portfolio" },
              { href: "/portal",    label: "Customer Portal"   },
              { href: "/contact",   label: "Partner with Us"   },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: ff.b,
                  fontSize: "9px",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: T.paper,
                  background: "transparent",
                  border: `1px solid rgba(255,255,255,0.25)`,
                  padding: "18px 48px",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  backdropFilter: "blur(4px)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.wine;
                  e.currentTarget.style.borderColor = T.wine;
                  e.currentTarget.style.boxShadow = `0 10px 40px ${T.wine}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: loaded ? 0.3 : 0,
            transition: "opacity 1s ease 1s",
          }}
        >
          <div style={{ width: "1px", height: "60px", background: `linear-gradient(to bottom, transparent, ${T.paper})`, margin: "0 auto" }} />
        </div>
      </section>

      {/* ── Brand Marquee ────────────────────────────────────────────────── */}
      <section style={{ background: T.bg, padding: "40px 0", borderBottom: `1px solid ${T.cream}`, overflow: "hidden" }}>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div 
          style={{ 
            display: "flex", 
            width: "max-content", 
            animation: "marquee 120s linear infinite",
            alignItems: "center",
            gap: "80px",
          }}
        >
          {/* Duplicate set for seamless looping */}
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "80px" }}>
              {partners.map((url, idx) => (
                <img 
                  key={`${url}-${idx}`}
                  src={url}
                  alt="Partner Brand" 
                  style={{ 
                    height: "45px", 
                    width: "auto", 
                    filter: "grayscale(1) opacity(0.5)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "grayscale(0) opacity(1)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "grayscale(1) opacity(0.5)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Strip ───────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "80px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 20px" }} />
              <h2
                style={{
                  fontFamily: ff.h,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  color: T.ink,
                  marginBottom: "16px",
                }}
              >
                Full-Service Partner
              </h2>
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "15px",
                  color: T.muted,
                  maxWidth: "560px",
                  margin: "0 auto",
                  lineHeight: 1.8,
                }}
              >
                The same suite of services as Park Street and MHW — with boutique
                attention and deep Caribbean &amp; Latin American expertise.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              { icon: "◈", title: "Import & Compliance",    desc: "TTB licensing, COLA registration, label approval, federal & state permits." },
              { icon: "◉", title: "Logistics & Warehousing", desc: "Bonded warehouse, temperature-controlled storage, freight coordination." },
              { icon: "◎", title: "26-State Distribution",   desc: "Self-distribution in NY, NJ & FL. Distributor network across 26 states." },
              { icon: "◆", title: "White Label",             desc: "Private-label wines, spirits, and beer — fully sourced and market-ready." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: "32px 28px",
                    background: T.bg,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      color: T.wine,
                      marginBottom: "16px",
                    }}
                  >
                    {s.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: ff.b,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: T.ink,
                      marginBottom: "10px",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: ff.b,
                      fontSize: "13px",
                      color: T.muted,
                      lineHeight: 1.7,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spain & Europe Callout ───────────────────────────────────────── */}
      <section
        style={{
          background: T.ink,
          padding: "100px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 60% at 80% 50%, ${T.wineDeep}40 0%, transparent 60%)`,
          }}
        />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          <div style={{ maxWidth: "600px" }}>
            <Reveal>
              <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "10px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: T.gold,
                  marginBottom: "20px",
                }}
              >
                Vinaio Spain &amp; Europe
              </p>
              <h2
                style={{
                  fontFamily: ff.h,
                  fontSize: "clamp(36px, 5vw, 60px)",
                  color: T.paper,
                  lineHeight: 1.1,
                  marginBottom: "24px",
                }}
              >
                Your gateway to the US market
              </h2>
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.8,
                  marginBottom: "40px",
                }}
              >
                We serve as exclusive US importer for Spain and European craft
                producers — handling TTB licensing, COLA registration,
                warehousing, and 26-state distribution so you can focus on what
                you do best.
              </p>
              <Link
                href="/spain"
                style={{
                  display: "inline-block",
                  fontFamily: ff.b,
                  fontSize: "10.5px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: T.gold,
                  border: `1px solid ${T.gold}40`,
                  padding: "14px 32px",
                }}
              >
                Explore Vinaio Spain →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Territory ────────────────────────────────────────────────────── */}
      <section style={{ background: T.cream, padding: "80px 56px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ margin: "0 auto 24px" }} />
            <h2
              style={{
                fontFamily: ff.h,
                fontSize: "clamp(28px, 3.5vw, 42px)",
                color: T.ink,
                marginBottom: "40px",
              }}
            >
              Distribution Reach
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2px",
              background: T.taupe,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {[
              { label: "26 States", sub: "Distribution Network" },
              { label: "NY · NJ · FL", sub: "Self-Distribution" },
              { label: "On & Off Premise", sub: "Channel Coverage" },
              { label: "10+ Brands", sub: "Portfolio & Growing" },
            ].map((s) => (
              <Reveal key={s.label}>
                <div
                  style={{
                    padding: "40px 28px",
                    background: T.paper,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: ff.h,
                      fontSize: "clamp(28px, 3vw, 40px)",
                      color: T.wine,
                      marginBottom: "8px",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontFamily: ff.b,
                      fontSize: "10px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: T.muted,
                    }}
                  >
                    {s.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "100px 56px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ margin: "0 auto 24px" }} />
            <h2
              style={{
                fontFamily: ff.h,
                fontSize: "clamp(32px, 4vw, 50px)",
                color: T.ink,
                marginBottom: "20px",
              }}
            >
              Ready to partner with Vinaio?
            </h2>
            <p
              style={{
                fontFamily: ff.b,
                fontSize: "14px",
                color: T.muted,
                lineHeight: 1.8,
                marginBottom: "40px",
              }}
            >
              Whether you&apos;re a retailer, restaurant, hotel, or international
              producer seeking US market access — let&apos;s talk.
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/contact"
                style={{
                  fontFamily: ff.b,
                  fontSize: "10.5px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: T.paper,
                  background: T.wine,
                  border: `1px solid ${T.wine}`,
                  padding: "16px 36px",
                }}
              >
                Get in Touch
              </Link>
              <Link
                href="/services"
                style={{
                  fontFamily: ff.b,
                  fontSize: "10.5px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: T.wine,
                  background: "transparent",
                  border: `1px solid ${T.taupe}`,
                  padding: "16px 36px",
                }}
              >
                Our Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
