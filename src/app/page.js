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
  const [loaded, setLoaded] = useState(false);
  const [hero, setHero] = useState({
    url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-vineyard-at-sunset-1148-large.mp4",
    type: "video",
    title: "",
    subtitle: "The bridge between terroir & the market"
  });
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // 1. Fetch Hero (Most recent active)
      const { data: heroData } = await supabase
        .from("site_hero")
        .select("*")
        .eq("active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      
      if (heroData) setHero(heroData);

      // 2. Fetch Partners
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
      console.warn("Failed to fetch dynamic content, using defaults.");
      setPartners(FALLBACK_LOGOS.map(l => `/logos/${l}`));
    }
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          background: `url('https://images.unsplash.com/photo-1506377247377-2a5b3b0ca706?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat`,
        }}
      >
        {hero.type === "video" ? (
          <video
            src={hero.url}
            autoPlay
            muted
            loop
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `url(${hero.url}) center/cover no-repeat`, opacity: 0.6 }} />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, transparent 0%, ${T.ink} 100%)`,
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
            padding: "0 48px",
          }}
        >
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transition: "all 1.2s ease 0.4s",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Hr w="40px" c={T.gold} />
            <span
              style={{
                fontFamily: ff.b,
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "6px",
                textTransform: "uppercase",
                color: T.gold,
              }}
            >
              Importers &amp; Distributors
            </span>
            <Hr w="40px" c={T.gold} />
          </div>

          <div
            style={{
              opacity: loaded ? 1 : 0,
              transition: "all 1.4s ease 0.2s",
              marginBottom: "40px",
              background: "rgba(255,255,255,0.9)",
              padding: "32px 64px",
              borderRadius: "8px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <img 
              src="/logo.png" 
              alt="Vinaio" 
              style={{ height: "clamp(60px, 8vw, 100px)", width: "auto" }} 
            />
          </div>

          <p
            style={{
              fontFamily: ff.h,
              fontSize: "clamp(32px, 5vw, 64px)",
              color: T.paper,
              opacity: loaded ? 1 : 0,
              transition: "all 1.2s ease 0.5s",
              marginBottom: "16px",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              maxWidth: "800px",
              lineHeight: 1.1
            }}
          >
            {hero.title}
          </p>

          <p
            style={{
              fontFamily: ff.b,
              fontSize: "clamp(17px, 2.2vw, 22px)",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.8)",
              opacity: loaded ? 1 : 0,
              transition: "all 1.2s ease 0.7s",
              marginBottom: "56px",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {hero.subtitle || "The bridge between terroir & the market"}
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              opacity: loaded ? 1 : 0,
              transition: "all 1.2s ease 0.9s",
            }}
          >
            {[
              { href: "/portfolio", label: "Explore Portfolio", primary: false },
              { href: "/portal",    label: "Customer Portal",   primary: true  },
              { href: "/services",  label: "Our Services",      primary: false },
            ].map(({ href, label, primary }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: ff.b,
                  fontSize: "10.5px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: primary ? T.paper : T.paper,
                  background: primary ? T.wine : "transparent",
                  border: `1px solid ${primary ? T.wine : "rgba(255,255,255,0.4)"}`,
                  padding: "16px 36px",
                  transition: "all 0.4s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.wine;
                  e.currentTarget.style.borderColor = T.wine;
                }}
                onMouseLeave={(e) => {
                  if (!primary) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  }
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
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: loaded ? 0.4 : 0,
            transition: "opacity 1s ease 1.5s",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "48px",
              background: `linear-gradient(to bottom, transparent, ${T.paper})`,
              margin: "0 auto",
            }}
          />
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
