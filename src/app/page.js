"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import ScrollLine from "@/components/ScrollLine";
import { createClient } from "@/lib/supabase/client";

// Fallback branding logos if DB is empty
const FALLBACK_LOGOS = [
  "brand-1.png", "brand-10.png", "brand-11.png", "brand-12.svg", "brand-13.png", 
  "brand-14.png", "brand-15.png", "brand-16.png", "brand-17.png", "brand-18.png"
];

// Sub-logos exclusively for the cinematic intro sequence
const INTRO_LOGOS = [
  "https://vinaio-bottles.b-cdn.net/logos/Vinaio%20Spain%20logo.svg",
  "https://vinaio-bottles.b-cdn.net/logos/Vinaio%20Elite%20logo.svg",
  "https://vinaio-bottles.b-cdn.net/logos/Vinaio%20Caribbean%20logo.svg",
  "https://vinaio-bottles.b-cdn.net/logos/Vinaio%20Logistics%20logo.svg"
];

export default function HomePage() {
  const supabase = createClient();
  const [loaded, setLoaded] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [partners, setPartners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hero, setHero] = useState({ 
    images: [], 
    title: "Curating Excellence",
    subtitle: "Transatlantic Spirits & Wine Purveyors"
  });
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  // Default elegant images from Unsplash to ensure background is NEVER black
  const DEFAULT_SLIDES = [
    "/images/hero/hero-rum.png",
    "/images/hero/hero-vineyard.png",
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=2048", // Vineyard/Wine
    "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=2048", // Barrels
    "https://images.unsplash.com/photo-1543412849-fd47250680ca?auto=format&fit=crop&q=80&w=2048"  // Bottles/Beach vibe
  ];

  useEffect(() => {
    // Cinematic Intro Timing
    setTimeout(() => {
      setIntroFading(true);
      setTimeout(() => {
        setIntroFinished(true);
        setLoaded(true); // Fade in the main site content after intro
      }, 1200); // Wait for the shatter blast to finish
    }, 6000); // Wait for 4 sequence explosions + main logo to play out

    fetchContent();
  }, []);

  // Simple slide timer for the "alive" effect
  useEffect(() => {
    const slideCount = (hero.images && hero.images.length > 0) ? hero.images.length : DEFAULT_SLIDES.length;
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slideCount);
    }, 8000); 
    return () => clearInterval(timer);
  }, [hero.images, DEFAULT_SLIDES.length]);

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
        setHero({ 
          ...heroData, 
          title: heroData.title || "Curating Excellence",
          subtitle: heroData.subtitle || "Transatlantic Spirits & Wine Purveyors",
          images: (urls && urls.length > 0) ? urls : [heroData.url] 
        });
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

      const { data: configData } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "branding")
        .single();
      
      if (configData?.value?.logo_url) {
        setLogoUrl(configData.value.logo_url);
      }
    } catch (err) {
      console.warn("Using default hero configuration.");
      setPartners(FALLBACK_LOGOS.map(l => `/logos/${l}`));
    }
  };

  const slides = (hero.images && hero.images.length > 0) ? hero.images : DEFAULT_SLIDES;

  return (
    <>
      {!introFinished && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
           {/* The Shards that make up the solid background initially */}
           {[
             { clip: "polygon(0% 0%, 50% 0%, 50% 50%)", trans: "translate(-50vw, -50vh) rotate(-15deg)" },
             { clip: "polygon(50% 0%, 100% 0%, 50% 50%)", trans: "translate(50vw, -40vh) rotate(20deg)" },
             { clip: "polygon(100% 0%, 100% 100%, 50% 50%)", trans: "translate(60vw, 10vh) rotate(10deg)" },
             { clip: "polygon(100% 100%, 50% 100%, 50% 50%)", trans: "translate(40vw, 50vh) rotate(-20deg)" },
             { clip: "polygon(50% 100%, 0% 100%, 50% 50%)", trans: "translate(-60vw, 40vh) rotate(25deg)" },
             { clip: "polygon(0% 100%, 0% 0%, 50% 50%)", trans: "translate(-50vw, -10vh) rotate(-10deg)" },
           ].map((shard, i) => (
             <div 
               key={i}
               style={{
                 position: 'absolute',
                 inset: 0,
                 background: T.metal,
                 clipPath: shard.clip,
                 transform: introFading ? shard.trans : "translate(0,0) rotate(0)",
                 opacity: introFading ? 0 : 1,
                 transition: "transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.8s ease-in 0.2s"
               }}
             />
           ))}

                       {/* ── Spotlight Lighting Effect ────────────────────────────────── */}
            {!introFading && (
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 0,
                pointerEvents: "none"
              }}>
                <div style={{
                  width: "600px",
                  height: "600px",
                  background: "radial-gradient(circle, rgba(194,163,85,0.15) 0%, rgba(194,163,85,0.05) 40%, transparent 70%)",
                  filter: "blur(60px)",
                  animation: "spotlightPulse 1.2s infinite alternate ease-in-out"
                }} />
              </div>
            )}
            {/* Cinematic Exploding Sub Logos */}
           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {INTRO_LOGOS.map((url, i) => (
               <div 
                 key={"sub-" + i}
                 style={{ 
                   position: "absolute",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                    opacity: 0,
                    filter: `drop-shadow(1.5px 0 0 ${T.gold}) drop-shadow(-1.5px 0 0 ${T.gold}) drop-shadow(0 1.5px 0 ${T.gold}) drop-shadow(0 -1.5px 0 ${T.gold}) drop-shadow(0 8px 24px rgba(0,0,0,0.6))`,
                    animation: introFading ? "none" : `explodeLogo 1s both cubic-bezier(0.165, 0.84, 0.44, 1)`,
                    animationDelay: `${i * 1.0}s`
                 }}
               >
                 <div
                   style={{
                     width: "280px",
                     height: "150px",
                     background: T.wine,
                     WebkitMaskImage: `url('${url}')`,
                     WebkitMaskSize: "contain",
                     WebkitMaskRepeat: "no-repeat",
                     WebkitMaskPosition: "center",
                     maskImage: `url('${url}')`,
                     maskSize: "contain",
                     maskRepeat: "no-repeat",
                     maskPosition: "center",
                   }}
                 />
               </div>
             ))}
           </div>

           {/* The dramatic Logo */}
           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div
               style={{ 
                 height: "140px", 
                 width: "500px", 
                 background: T.wine,
                 WebkitMaskImage: `url('${logoUrl}')`,
                 WebkitMaskSize: "contain",
                 WebkitMaskRepeat: "no-repeat",
                 WebkitMaskPosition: "center",
                 maskImage: `url('${logoUrl}')`,
                 maskSize: "contain",
                 maskRepeat: "no-repeat",
                 maskPosition: "center",
                 opacity: 0,
                 filter: `drop-shadow(2px 0 0 ${T.gold}) drop-shadow(-2px 0 0 ${T.gold}) drop-shadow(0 2px 0 ${T.gold}) drop-shadow(0 -2px 0 ${T.gold}) drop-shadow(0 12px 32px rgba(0,0,0,0.7))`,
                 animation: introFading ? "shatterBlast 1s forwards cubic-bezier(0.4, 0, 0.2, 1)" : "logoEntrance 1.8s both cubic-bezier(0.2, 0.8, 0.2, 1)",
                 animationDelay: introFading ? "0s" : "4.0s"
               }} 
             />
           </div>
        </div>
      )}

      <style>{`
        @keyframes explodeLogo {
          0% { opacity: 0; transform: scale(0.3) translateY(20px); filter: blur(5px); }
          20% { opacity: 1; transform: scale(1.1) translateY(0px); filter: blur(0px); }
          50% { opacity: 1; transform: scale(1); filter: blur(0px); }
          80% { opacity: 1; transform: scale(1.2); filter: blur(0px); }
          100% { opacity: 0; transform: scale(3.5); filter: blur(10px); }
        }
        @keyframes logoEntrance {
          0% { transform: scale(0.3); opacity: 0; filter: blur(20px); }
          30% { transform: scale(1.1); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0px); }
        }
        @keyframes shatterBlast {
          0% { transform: scale(1); opacity: 1; filter: blur(0px); }
          20% { transform: scale(1.4); opacity: 1; filter: blur(0px); }
          100% { transform: scale(5); opacity: 0; filter: blur(20px); }
        }
        @keyframes spotlightPulse {
          0% { transform: scale(0.8); opacity: 0.3; }
          100% { transform: scale(1.1); opacity: 1; }
        }
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
          background: T.ink,
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
            background: `linear-gradient(to bottom, ${T.ink} 0%, transparent 30%, transparent 70%, ${T.ink} 100%)`,
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

          <div style={{ opacity: loaded ? 1 : 0, transition: "all 1s ease 0.3s", marginBottom: "20px" }}>
            <img 
              src={logoUrl} 
              alt="Vinaio" 
              style={{ 
                height: "80px", 
                width: "auto", 
                filter: "brightness(0) invert(1)",
                marginBottom: "20px"
              }} 
            />
          </div>

          <h1
            style={{
              fontFamily: ff.h,
              fontSize: "clamp(42px, 8vw, 110px)",
              color: T.paper,
              lineHeight: 0.9,
              marginBottom: "32px",
              opacity: loaded ? 1 : 0,
              transition: "all 1s ease 0.4s",
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              maxWidth: "1100px",
              fontWeight: 400
            }}
          >
            {hero.title}
          </h1>

          <p
            style={{
              fontFamily: ff.b,
              fontSize: "clamp(14px, 1.4vw, 18px)",
              color: T.paper,
              opacity: loaded ? 0.9 : 0,
              transition: "all 1s ease 0.5s",
              marginBottom: "56px",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              maxWidth: "800px",
              lineHeight: 1.6,
              fontWeight: 500,
              letterSpacing: "4px",
              textTransform: "uppercase"
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
                A comprehensive suite of import, compliance, and distribution solutions — delivered with boutique
                attention and deep Caribbean &amp; Latin American expertise.
              </p>
            </div>
          </Reveal>

          <ScrollLine height="80px" color={T.wine} bgColor={`${T.wine}10`} nodeBg={T.paper} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              { title: "Import & Compliance",    desc: "TTB licensing, COLA registration, label approval, federal & state permits." },
              { title: "Logistics & Warehousing", desc: "Bonded warehouse, temperature-controlled storage, freight coordination." },
              { title: "Importer & Wholesaler",   desc: "Sourcing direct from global producers" },
              { title: "White Label",             desc: "Private-label wines, spirits, and beer — fully sourced and market-ready." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div
                  style={{
                    background: T.bg,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: "240px",
                    transition: "all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.borderColor = T.wine;
                    e.currentTarget.style.boxShadow = `0 20px 40px ${T.wine}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = T.cream;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ flex: 1, padding: "32px 28px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: ff.b,
                        fontSize: "14px",
                        color: T.muted,
                        lineHeight: 1.6,
                        margin: 0
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                  
                  {/* Burgundy Bottom Strip for Title */}
                  <div style={{ background: T.wine, padding: "18px 20px", textAlign: "center" }}>
                    <h3
                      style={{
                        fontFamily: ff.b,
                        fontSize: "10px",
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: T.paper,
                        margin: 0
                      }}
                    >
                      {s.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spain & Europe Callout ───────────────────────────────────────── */}
      <div style={{ background: T.bg, padding: "40px 0" }}>
        <ScrollLine height="100px" color={T.gold} bgColor={"rgba(255,255,255,0.05)"} nodeBg={T.ink} />
      </div>
      <section
        style={{
          background: T.metal,
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
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            {[
              { label: "Full Service Distributor", sub: "New York, New Jersey and Florida" },
              { label: "26-State Distribution",   sub: "Self-distribution in NY, NJ & FL. Distributor network across 26 states." },
              { label: "Curated Portfolio",       sub: "Over 100+ award winning world wide brands" },
              { label: "White Glove Delivery",    sub: "70 Refrigerated delivery trucks" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div
                  className="territory-box"
                  style={{
                    background: T.paper,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "12px",
                    transition: "all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: "220px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.borderColor = T.wine;
                    e.currentTarget.style.boxShadow = `0 20px 40px ${T.wine}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = T.cream;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Content Area (Centered) */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: ff.b,
                        fontSize: "14px",
                        color: T.muted,
                        lineHeight: 1.6,
                        margin: 0
                      }}
                    >
                      {s.sub}
                    </p>
                  </div>
                  
                  {/* Burgundy Bottom Strip for Title */}
                  <div style={{
                    background: T.wine,
                    padding: "20px 24px",
                    width: "100%",
                    marginTop: "auto",
                    textAlign: "center"
                  }}>
                    <h3
                      style={{
                        fontFamily: ff.b,
                        fontSize: "10px",
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        color: T.paper,
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.4
                      }}
                    >
                      {s.label}
                    </h3>
                  </div>
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
