"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import ScrollLine from "@/components/ScrollLine";
import { createClient } from "@/lib/supabase/client";
import SmartLink from "@/components/SmartLink";

// Fallback branding logos if DB is empty
const FALLBACK_LOGOS = [
  "brand-1.png", "brand-10.png", "brand-11.png", "brand-12.svg", "brand-13.png", 
  "brand-14.png", "brand-15.png", "brand-16.png", "brand-17.png", "brand-18.png"
];

// Sub-logos exclusively for the cinematic intro sequence
const INTRO_LOGOS = [
  "https://vinaio-bottles-cdn.b-cdn.net/logos/Vinaio%20Spain%20logo.svg",
  "https://vinaio-bottles-cdn.b-cdn.net/logos/Vinaio%20Elite%20logo.svg",
  "https://vinaio-bottles-cdn.b-cdn.net/logos/Vinaio%20Caribbean%20logo.svg",
  "https://vinaio-bottles-cdn.b-cdn.net/logos/Vinaio%20Logistics%20logo.svg"
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

  // Beautiful, moody, high-contrast imagery perfectly suited for the burgundy logo and white text
  const DEFAULT_SLIDES = [
    // 1. A beautiful Spanish winery estate at twilight (dark and atmospheric)
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2048",
    // 2. Wine being consumed and enjoyed (moody, luxury restaurant aesthetic)
    "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80&w=2048",
    // 3. A Rum distillery / dark barrel room
    "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=2048"
  ];

  useEffect(() => {
    // Cinematic Intro Timing
    // The logo entrance takes 1.6s. We wait an additional 2.5s before fading.
    setTimeout(() => {
      setIntroFading(true);
      setTimeout(() => {
        setIntroFinished(true);
        setLoaded(true); // Fade in the main site content after intro
      }, 1000); // Exit blast duration
    }, 100); // Start the opening effect immediately

    fetchContent();
  }, []);

  // Simple slide timer for the "alive" effect
  useEffect(() => {
    const slideCount = DEFAULT_SLIDES.length;
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slideCount);
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
        setHero({ 
          ...heroData, 
          title: heroData.title || "Curating Excellence",
          subtitle: heroData.subtitle || "Transatlantic Spirits & Wine Purveyors",
          // Ignore DB urls to fix the black screen issue and enforce the new curated slides
          images: DEFAULT_SLIDES
        });
      }

      const { data: partnersData } = await supabase
        .from("site_partners")
        .select("*")
        .eq("active", true)
        .order("order", { ascending: true });
      
      if (partnersData && partnersData.length > 0) {
        setPartners(partnersData.map(p => ({ url: p.logo_url, name: p.name || p.brand })));
      } else {
        setPartners(FALLBACK_LOGOS.map(l => ({ 
          url: `/logos/${l}`, 
          name: l.split('.')[0].replace('brand-', 'Brand ') 
        })));
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
      setPartners(FALLBACK_LOGOS.map(l => ({ 
        url: `/logos/${l}`, 
        name: l.split('.')[0].replace('brand-', 'Brand ') 
      })));
    }
  };

  const slides = DEFAULT_SLIDES;

  return (
    <>
      {!introFinished && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
           {/* The Shards that make up the solid background initially */}
           {[
             { clip: "polygon(-2% -2%, 102% -2%, 50% 51%)", trans: "translate(0, -60vh) scale(0.8)" },
             { clip: "polygon(102% -2%, 102% 102%, 49% 50%)", trans: "translate(60vw, 0) scale(0.8)" },
             { clip: "polygon(102% 102%, -2% 102%, 50% 49%)", trans: "translate(0, 60vh) scale(0.8)" },
             { clip: "polygon(-2% 102%, -2% -2%, 51% 50%)", trans: "translate(-60vw, 0) scale(0.8)" },
           ].map((shard, i) => (
             <div 
               key={i}
               style={{
                 position: 'absolute',
                 inset: 0,
                 background: T.silk,
                 clipPath: shard.clip,
                 transform: introFading ? shard.trans : "translate(0,0) rotate(0)",
                 opacity: introFading ? 0 : 1,
                 transition: "transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.8s ease-in 0.2s"
               }}
             />
           ))}

           {/* Cinematic Exploding Sub Logos removed for a faster, immediate main logo entrance */}

           {/* Logo removed to start immediately with the opening effect */}
        </div>
      )}

      <style>{`
        @keyframes explodeLogo {
          0% { opacity: 0; transform: scale(0.6) translateY(10px); filter: blur(4px); }
          25% { opacity: 1; transform: scale(1.05) translateY(0px); filter: blur(0px); }
          50% { opacity: 1; transform: scale(1); filter: blur(0px); }
          75% { opacity: 1; transform: scale(1.1); filter: blur(0px); }
          100% { opacity: 0; transform: scale(1.8); filter: blur(8px); }
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

        /* Responsive Homepage Styles */
        @media (max-width: 1024px) {
          .hero-content { padding: 0 5vw !important; }
          .hero-logo-wrapper { height: 90px !important; width: 340px !important; }
          .hero-contrast-strip { height: 110px !important; }
          .homepage-section { padding: 80px 24px !important; }
        }
        @media (max-width: 768px) {
          .homepage-section { padding: 60px 20px !important; }
          .hero-logo-wrapper { height: 70px !important; width: 260px !important; }
          .hero-contrast-strip { height: 85px !important; }
          .experience-grid { grid-template-columns: 1fr !important; }
          .experience-card { height: 380px !important; }
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
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} 
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
          className="hero-content"
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
            <Hr w="40px" c={T.paper} style={{ opacity: 0.5 }} />
            <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "6px", textTransform: "uppercase", color: T.paper }}>
              Importers &amp; Distributors
            </span>
            <Hr w="40px" c={T.paper} style={{ opacity: 0.5 }} />
          </div>

          <div 
            style={{ 
              opacity: loaded ? 1 : 0, 
              transition: "all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s", 
              marginBottom: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              position: "relative"
            }}
          >
            {/* The White Contrast Strip */}
            <div 
              className="hero-contrast-strip"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100vw",
                top: "-10px",
                height: "140px",
                background: "rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(12px)",
                zIndex: -1
              }} 
            />
            <div
              className="hero-logo-wrapper"
              style={{
                height: "120px",
                width: "450px",
                background: "#9B2335",
                WebkitMaskImage: `url('${logoUrl}')`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: `url('${logoUrl}')`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
                margin: "0 auto",
                filter: `
                  drop-shadow(2px 0 0 white) 
                  drop-shadow(-2px 0 0 white) 
                  drop-shadow(0 2px 0 white) 
                  drop-shadow(0 -2px 0 white) 
                  drop-shadow(0 12px 24px rgba(0,0,0,0.4))
                `
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
              {partners.map((p, idx) => (
                <SmartLink key={`${p.url}-${idx}`} text={p.name} style={{ borderBottom: "none" }}>
                  <img 
                    src={p.url}
                    alt={p.name} 
                    style={{ 
                      height: "45px", 
                      width: "auto", 
                      filter: "grayscale(1) opacity(0.5)",
                      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer"
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
                </SmartLink>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Strip ───────────────────────────────────────────────── */}
      <section className="homepage-section" style={{ background: T.paper, padding: "80px 56px" }}>
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
              <Reveal key={s.title} delay={i * 0.2}>
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

      {/* ── Experience Hubs ──────────────────────────────────────────────── */}
      <section className="homepage-section" style={{ background: T.editorialGrey, padding: "60px 56px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 24px" }} />
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", color: T.wine, marginBottom: "16px" }}>
                Curating Authority
              </p>
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4.5vw, 56px)", color: T.paper, marginBottom: "20px" }}>
                Discover the Vinaio Experience
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
                Step into the stories, traditions, and craftsmanship behind our curated portfolio through our immersive educational hubs.
              </p>
            </div>
          </Reveal>

          <div className="experience-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "32px" }}>
            {[
              { 
                title: "World of Wines", 
                href: "/experiences/wine", 
                img: "/images/experiences/wine_experience.png",
                desc: "Explore regions, grapes, food pairings, and the producers behind every bottle in our global wine collection."
              },
              { 
                title: "Vinaio House of Rum", 
                href: "/experiences/rum", 
                img: "/images/experiences/rum_experience.png",
                desc: "Discover barrel aging, cocktail craft, Caribbean heritage, and the distilleries shaping the spirit's future."
              }
            ].map((exp, i) => (
              <Reveal key={exp.href} delay={i * 0.2}>
                <Link href={exp.href} className="experience-card" style={{ textDecoration: "none", display: "block", position: "relative", overflow: "hidden", borderRadius: "16px", height: "480px" }}>
                  <div style={{ position: "absolute", inset: 0, transition: "transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                    <img src={exp.img} alt={exp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                  </div>
                  
                  <div style={{ position: "absolute", bottom: "48px", left: "48px", right: "48px", zIndex: 10 }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "32px", color: T.paper, marginBottom: "12px" }}>{exp.title}</h3>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: "24px", maxWidth: "400px" }}>
                      {exp.desc}
                    </p>
                    <div style={{ 
                      display: "inline-block", 
                      padding: "12px 24px", 
                      border: "1px solid rgba(255,255,255,0.3)", 
                      color: T.paper, 
                      fontFamily: ff.b, 
                      fontSize: "10px", 
                      letterSpacing: "3px", 
                      textTransform: "uppercase",
                      transition: "all 0.3s"
                    }}>
                      Enter Experience →
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spain & Europe Callout ───────────────────────────────────────── */}
      <div style={{ background: T.editorialGrey, padding: "40px 0" }}>
        <ScrollLine height="100px" color={T.wine} bgColor={"rgba(255,255,255,0.05)"} nodeBg={T.editorialGrey} />
      </div>
      <section
        className="homepage-section"
        style={{
          background: T.editorialGrey,
          padding: "120px 56px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Reveal>
              <img 
                src="https://vinaio-bottles-cdn.b-cdn.net/logos/Vinaio%20Spain%20logo.svg" 
                alt="Vinaio Spain" 
                style={{ height: "100px", marginBottom: "40px", filter: "brightness(0.9)" }} 
              />
              <Hr w="40px" c={T.wine} style={{ margin: "0 auto 32px" }} />
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "11px",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  color: T.wine,
                  marginBottom: "24px",
                  fontWeight: 600
                }}
              >
                European Distribution Hub
              </p>
              <h2
                style={{
                  fontFamily: ff.h,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  color: T.ink,
                  lineHeight: 1.1,
                  marginBottom: "32px",
                }}
              >
                Your Gateway to Europe
              </h2>
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "17px",
                  color: "rgba(0,0,0,0.7)",
                  lineHeight: 1.8,
                  marginBottom: "48px",
                  maxWidth: "700px",
                  margin: "0 auto 48px"
                }}
              >
                Vinaio Spain is your strategic partner for European expansion. 
                As a premier importer and distributor, we provide a direct corridor into 
                the heart of Spain and Italy, managing complex logistics and market 
                integration so your products can reach the most celebrated tables in Europe.
              </p>
              <Link
                href="/spain"
                style={{
                  display: "inline-block",
                  fontFamily: ff.b,
                  fontSize: "11px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "white",
                  background: T.wine,
                  padding: "18px 48px",
                  borderRadius: "4px",
                  boxShadow: "0 10px 30px rgba(155, 35, 53, 0.2)",
                  textDecoration: "none"
                }}
              >
                Explore Vinaio Spain →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Territory ────────────────────────────────────────────────────── */}
      <section className="homepage-section" style={{ background: T.cream, padding: "80px 56px" }}>
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
              { label: "International Reach", sub: "Network across 26 US states, full distribution in Spain and Italy." },
              { label: "Curated Portfolio",       sub: "Over 100+ award winning world wide brands" },
              { label: "White Glove Delivery",    sub: "70 Refrigerated delivery trucks" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.2}>
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
            <Hr w="32px" c={T.wine} style={{ margin: "0 auto 24px" }} />
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
