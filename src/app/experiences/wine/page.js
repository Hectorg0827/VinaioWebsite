"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

/* ── SVG Icons (replacing emojis with premium line art) ─────────────────── */
const IconGlobe = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.wine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconGrape = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.wine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3"/><circle cx="8" cy="13" r="3"/><circle cx="16" cy="13" r="3"/><circle cx="12" cy="18" r="3"/><path d="M12 2v3"/><path d="M10 3l4 2"/></svg>
);
const IconPlate = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.wine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const IconCalendar = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.wine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const IconWineGlass = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M6 2l.93 6.97c.29 2.19 2.12 3.83 4.33 3.83h1.48c2.21 0 4.04-1.64 4.33-3.83L18 2"/></svg>
);

/* ── Navigation sections ─────────────────────────────────────────────────── */
const SECTIONS = [
  { id: "journey",     label: "Journey" },
  { id: "regions",     label: "Regions" },
  { id: "grapes",      label: "Grapes" },
  { id: "pairings",    label: "Pairings" },
  { id: "collections", label: "Collections" },
  { id: "producers",   label: "Producers" },
];

/* ── Content Data ────────────────────────────────────────────────────────── */

const WINE_REGIONS = [
  {
    name: "Spain",
    iso: "es",
    terroir: "Dramatic limestone plateaus, old-vine Garnacha, and sun-baked Tempranillo. Spain is the heart of the Vinaio European expansion.",
    climate: "Continental & Mediterranean",
    featured: ["Cepa 21", "Campos Reales", "Castillo de Sajazarra"],
    img: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Italy",
    iso: "it",
    terroir: "From the Valpolicella highlands to the Primitivo vineyards of Salento — Italian wine is the language of balance and heritage.",
    climate: "Alpine to Mediterranean",
    featured: ["Italo Cescon", "Cantine Leuci", "Monte Tondo"],
    img: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "South Africa",
    iso: "za",
    terroir: "Stellenbosch's granite-rich soils and the cool-climate vineyards of the Western Cape produce wines of intensity and elegance.",
    climate: "Maritime Mediterranean",
    featured: ["Babylonstoren"],
    img: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "South America",
    iso: "ar",
    terroir: "High-altitude Malbecs from Mendoza, robust Chilean Cabernets from the Maipo Valley — the New World's boldest expressions.",
    climate: "Andean Continental",
    featured: ["Viña Maipo", "Barrica 29"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "France",
    iso: "fr",
    terroir: "Legendary terroir and centuries of technique. From organic Bordeaux blends to the sun-warmed rosés of Provence.",
    climate: "Oceanic & Continental",
    featured: ["Château des Deux Rives"],
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800"
  }
];

const GRAPE_LIBRARY = [
  { name: "Tempranillo", body: "Medium–Full", acidity: "Medium", profile: "Cherry, leather, vanilla, tobacco", food: "Grilled lamb, aged cheeses, charcuterie", vinaioWine: "Cepa 21 · Ribera del Duero" },
  { name: "Albariño", body: "Light–Medium", acidity: "High", profile: "Peach, citrus, saline minerality", food: "Oysters, ceviche, grilled fish", vinaioWine: "Altos de Torona · Rías Baixas" },
  { name: "Cabernet Sauvignon", body: "Full", acidity: "Medium–High", profile: "Blackcurrant, cedar, graphite", food: "Ribeye steak, short ribs, dark chocolate", vinaioWine: "Babylonstoren · Stellenbosch" },
  { name: "Garnacha", body: "Medium–Full", acidity: "Medium", profile: "Raspberry, white pepper, garrigue", food: "Roasted vegetables, paella, grilled sausage", vinaioWine: "Campos Reales · La Mancha" },
  { name: "Verdejo", body: "Light–Medium", acidity: "High", profile: "Lime, fennel, white flowers", food: "Tapas, goat cheese, asparagus", vinaioWine: "Copaboca Gorgorito · Rueda" },
  { name: "Chenin Blanc", body: "Medium", acidity: "High", profile: "Quince, honey, wet stone", food: "Thai curry, roasted pork, apple tart", vinaioWine: "Babylonstoren · Western Cape" },
];

const PAIRING_GUIDE = [
  { food: "Grilled Steak", emoji: "🥩", wines: ["Cabernet Sauvignon", "Tempranillo", "Malbec"], pick: "Cepa 21 Hito Red" },
  { food: "Fresh Seafood", emoji: "🦐", wines: ["Albariño", "Verdejo", "Chenin Blanc"], pick: "Altos de Torona Albariño" },
  { food: "Pasta & Tomato", emoji: "🍝", wines: ["Primitivo", "Garnacha", "Sangiovese"], pick: "Cantine Leuci Primitivo" },
  { food: "Spicy Cuisine", emoji: "🌶️", wines: ["Rosé", "Gewürztraminer", "Moscato"], pick: "Campos Reales Rosé" },
  { food: "Cheese Board", emoji: "🧀", wines: ["Tempranillo Reserva", "Chenin Blanc", "Verdejo"], pick: "Castillo de Sajazarra Reserva" },
  { food: "Celebration", emoji: "🥂", wines: ["Prosecco", "Cava", "Sparkling Rosé"], pick: "Asolo Prosecco Superiore" },
];

const CURATED_COLLECTIONS = [
  { name: "Summer Wines", desc: "Light, crisp, and refreshing. Perfect for warm evenings.", bottles: ["Altos de Torona Albariño", "Campos Reales Rosé", "Babylonstoren Sprankel"] },
  { name: "Dinner Party Picks", desc: "Crowd-pleasers that pair with everything on the table.", bottles: ["Cepa 21 Hito Red", "Babylonstoren Chardonnay", "Clos Montblanc Xipella Red"] },
  { name: "Wines for Steak", desc: "Bold reds built for the grill and the flame.", bottles: ["Cepa 21 Malabrigo", "Barrica 29 Malbec", "Babylonstoren Cabernet Sauvignon"] },
  { name: "Beginner-Friendly", desc: "Approachable, elegant, and easy to love from the first sip.", bottles: ["Campos Reales Tempranillo", "Copaboca Gorgorito Verdejo", "Cantine Leuci Primitivo"] },
];

const PRODUCER_STORIES = [
  {
    name: "Cepa 21",
    region: "Ribera del Duero, Spain",
    quote: "We believe in the power of Tempranillo to express the soul of Castilla — honest, deep, and unforgettable.",
    signature: "Cepa 21 Horcajo",
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Babylonstoren",
    region: "Stellenbosch, South Africa",
    quote: "Our farm has been cultivated for over 300 years. Every bottle carries that history — rooted, alive, and full of terroir.",
    signature: "Babylonstoren Nebukadnesar",
    img: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Altos de Torona",
    region: "Rías Baixas, Spain",
    quote: "The Atlantic wind and the granite soil give Albariño its tension, its salinity, its sense of place.",
    signature: "Altos de Torona Albariño",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800"
  },
];

/* ── Sticky Subnav Component ─────────────────────────────────────────────── */
function StickySubnav({ sections, activeSection }) {
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 800,
      background: "rgba(248,246,243,0.95)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${T.cream}`,
      padding: "0 56px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {sections.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            style={{
              padding: "18px 20px",
              fontFamily: ff.b,
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              color: activeSection === s.id ? T.wine : T.muted,
              borderBottom: activeSection === s.id ? `2px solid ${T.wine}` : "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "all 0.3s",
              fontWeight: activeSection === s.id ? 700 : 400,
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function WorldOfWinesPage() {
  const [activeSection, setActiveSection] = useState("journey");
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > window.innerHeight * 0.7);

      const offsets = SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el ? el.getBoundingClientRect().top : Infinity };
      });
      const current = offsets.filter(o => o.top <= 200).pop();
      if (current) setActiveSection(current.id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main style={{ background: T.bg, minHeight: "100vh" }}>

      {/* ══════════════════════════════════════════════════════════════════
          §1 — HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        height: "85vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}>
        <img
          src="/images/experiences/wine_experience.png"
          alt="World of Wines"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)" }} />

        <div style={{ position: "relative", textAlign: "center", padding: "0 20px", zIndex: 10 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
              <Hr w="40px" c={T.paper} />
              <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.paper }}>
                Vinaio Editorial Experience
              </span>
              <Hr w="40px" c={T.paper} />
            </div>
            <h1 style={{
              fontFamily: ff.h,
              fontSize: "clamp(48px, 8vw, 100px)",
              color: T.paper,
              lineHeight: 1,
              marginBottom: "32px",
              fontWeight: 400
            }}>
              World of Wines
            </h1>
            <p style={{
              fontFamily: ff.b,
              fontSize: "17px",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "650px",
              margin: "0 auto",
              lineHeight: 1.7,
              letterSpacing: "0.5px"
            }}>
              From the limestone plateaus of Ribera del Duero to the granite slopes of Stellenbosch — discover the regions, grapes, and producers that define the Vinaio wine portfolio.
            </p>
          </Reveal>
        </div>

        <div style={{ position: "absolute", bottom: "48px", left: "50%", transform: "translateX(-50%)", opacity: 0.4 }}>
          <div style={{ width: "1px", height: "60px", background: `linear-gradient(to bottom, transparent, ${T.paper})`, margin: "0 auto" }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §2 — STICKY SUBNAV
      ══════════════════════════════════════════════════════════════════ */}
      {showNav && <StickySubnav sections={SECTIONS} activeSection={activeSection} />}

      {/* ══════════════════════════════════════════════════════════════════
          §3 — CHOOSE YOUR JOURNEY
      ══════════════════════════════════════════════════════════════════ */}
      <section id="journey" style={{ padding: "120px 56px", background: T.paper }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ margin: "0 auto 28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              Choose Your Journey
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "560px", margin: "0 auto 64px", lineHeight: 1.8 }}>
              There is no single way to explore wine. Start from where your curiosity leads — every path connects back to the Vinaio portfolio.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
            {[
              { icon: <IconGlobe />, label: "By Region", desc: "Spain, Italy, South Africa, France, South America", anchor: "regions" },
              { icon: <IconGrape />, label: "By Grape", desc: "Tempranillo, Albariño, Cabernet, Garnacha, Chenin Blanc", anchor: "grapes" },
              { icon: <IconPlate />, label: "By Pairing", desc: "Steak, seafood, pasta, cheese, celebration", anchor: "pairings" },
              { icon: <IconCalendar />, label: "By Occasion", desc: "Summer, dinner party, date night, beginner picks", anchor: "collections" },
            ].map((path, i) => (
              <Reveal key={path.label} delay={i * 0.1}>
                <a
                  href={`#${path.anchor}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById(path.anchor)?.scrollIntoView({ behavior: "smooth" }); }}
                  style={{
                    display: "block",
                    padding: "40px 24px",
                    background: T.bg,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "16px",
                    textDecoration: "none",
                    textAlign: "center",
                    transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.wine; e.currentTarget.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.cream; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ marginBottom: "20px" }}>{path.icon}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "22px", color: T.ink, marginBottom: "12px" }}>{path.label}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.6 }}>{path.desc}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §4 — WINE REGIONS WE CHAMPION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="regions" style={{ padding: "120px 56px", background: T.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              Wine Regions We Champion
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Vinaio does not simply source from famous regions. We partner with specific producers who define the character of their land.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {WINE_REGIONS.map((region, i) => (
              <Reveal key={region.name} delay={i * 0.08}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1.2fr 1fr" : "1fr 1.2fr",
                  gap: "48px",
                  alignItems: "center",
                  background: T.paper,
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `1px solid ${T.cream}`,
                }}>
                  <div style={{ order: i % 2 === 0 ? 0 : 1, height: "360px", overflow: "hidden" }}>
                    <img src={region.img} alt={region.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "48px", order: i % 2 === 0 ? 1 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                      <img
                        src={`https://flagcdn.com/w80/${region.iso}.png`}
                        alt={region.name}
                        style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "50%", border: `2px solid ${T.cream}` }}
                      />
                      <h3 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>{region.name}</h3>
                    </div>
                    <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.wine, marginBottom: "16px" }}>
                      {region.climate}
                    </p>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, lineHeight: 1.8, marginBottom: "24px" }}>
                      {region.terroir}
                    </p>
                    <div style={{ borderTop: `1px solid ${T.cream}`, paddingTop: "20px" }}>
                      <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.deep, marginBottom: "8px" }}>
                        Featured Vinaio Producers
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {region.featured.map(f => (
                          <span key={f} style={{ padding: "6px 14px", background: T.wineGlow, color: T.wine, borderRadius: "20px", fontFamily: ff.b, fontSize: "11px", fontWeight: 600 }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §5 — GRAPE LIBRARY
      ══════════════════════════════════════════════════════════════════ */}
      <section id="grapes" style={{ padding: "120px 56px", background: T.paper }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              The Grape Library
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Every varietal tells a different story on the palate. Learn the character of the grapes behind our portfolio — and find your next favorite bottle.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {GRAPE_LIBRARY.map((grape, i) => (
              <Reveal key={grape.name} delay={i * 0.06}>
                <div style={{
                  background: T.bg,
                  borderRadius: "16px",
                  border: `1px solid ${T.cream}`,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.wine}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.cream}
                >
                  <div style={{ padding: "32px 32px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <IconWineGlass />
                      <h3 style={{ fontFamily: ff.h, fontSize: "26px", color: T.ink }}>{grape.name}</h3>
                    </div>

                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.deep, lineHeight: 1.6, marginBottom: "20px", fontStyle: "italic" }}>
                      {grape.profile}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      <div>
                        <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "4px" }}>Body</p>
                        <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.ink, fontWeight: 600 }}>{grape.body}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "4px" }}>Acidity</p>
                        <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.ink, fontWeight: 600 }}>{grape.acidity}</p>
                      </div>
                    </div>

                    <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.6 }}>
                      <strong style={{ color: T.deep }}>Pairs with:</strong> {grape.food}
                    </p>
                  </div>

                  <div style={{ marginTop: "auto", background: T.wine, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "2px" }}>Try from Vinaio</p>
                      <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.paper, fontWeight: 600 }}>{grape.vinaioWine}</p>
                    </div>
                    <Link href="/portfolio" style={{ fontFamily: ff.b, fontSize: "10px", color: T.gold, textDecoration: "none", letterSpacing: "1px" }}>
                      View →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §6 — PAIRING STUDIO
      ══════════════════════════════════════════════════════════════════ */}
      <section id="pairings" style={{ padding: "120px 56px", background: T.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              The Pairing Studio
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              What are you eating tonight? Let us match it with the perfect bottle from our portfolio.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {PAIRING_GUIDE.map((pair, i) => (
              <Reveal key={pair.food} delay={i * 0.06}>
                <div style={{
                  background: T.paper,
                  borderRadius: "16px",
                  border: `1px solid ${T.cream}`,
                  padding: "36px",
                  transition: "all 0.4s",
                  height: "100%",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.wine; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.cream; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "20px" }}>{pair.emoji}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "16px" }}>{pair.food}</h3>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                    {pair.wines.map(w => (
                      <span key={w} style={{ padding: "4px 12px", background: T.bg, borderRadius: "20px", fontFamily: ff.b, fontSize: "11px", color: T.muted }}>
                        {w}
                      </span>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${T.cream}`, paddingTop: "16px" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.wine, marginBottom: "4px" }}>Vinaio Pick</p>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.ink, fontWeight: 600 }}>{pair.pick}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §7 — CURATED COLLECTIONS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="collections" style={{ padding: "120px 56px", background: T.paper }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              Curated Collections
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Not sure where to start? We have assembled collections for every mood, moment, and craving.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {CURATED_COLLECTIONS.map((col, i) => (
              <Reveal key={col.name} delay={i * 0.08}>
                <div style={{
                  background: T.bg,
                  borderRadius: "16px",
                  border: `1px solid ${T.cream}`,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.wine}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.cream}
                >
                  <div style={{ padding: "36px 28px", flexGrow: 1 }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "12px" }}>{col.name}</h3>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, lineHeight: 1.6, marginBottom: "24px" }}>{col.desc}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {col.bottles.map(b => (
                        <li key={b} style={{ fontFamily: ff.b, fontSize: "13px", color: T.deep, padding: "8px 0", borderBottom: `1px solid ${T.cream}`, display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: T.wine, fontSize: "8px" }}>●</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/portfolio" style={{
                    display: "block",
                    textAlign: "center",
                    padding: "16px",
                    background: T.wine,
                    color: T.paper,
                    fontFamily: ff.b,
                    fontSize: "10px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}>
                    Explore in Portfolio →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §8 — PRODUCER STORIES
      ══════════════════════════════════════════════════════════════════ */}
      <section id="producers" style={{ padding: "120px 56px", background: T.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              From the Cellar: Producer Stories
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Behind every bottle is a person, a place, and a philosophy. Meet the winemakers who trust Vinaio to bring their vision to the American market.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {PRODUCER_STORIES.map((producer, i) => (
              <Reveal key={producer.name} delay={i * 0.1}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr 1.5fr" : "1.5fr 1fr",
                  gap: "0",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `1px solid ${T.cream}`,
                  background: T.paper,
                }}>
                  <div style={{ order: i % 2 === 0 ? 0 : 1, height: "400px", overflow: "hidden" }}>
                    <img src={producer.img} alt={producer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ order: i % 2 === 0 ? 1 : 0, padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.wine, marginBottom: "16px" }}>{producer.region}</p>
                    <h3 style={{ fontFamily: ff.h, fontSize: "36px", color: T.ink, marginBottom: "24px" }}>{producer.name}</h3>
                    <blockquote style={{
                      fontFamily: ff.h,
                      fontSize: "18px",
                      color: T.deep,
                      lineHeight: 1.7,
                      fontStyle: "italic",
                      borderLeft: `3px solid ${T.wine}`,
                      paddingLeft: "24px",
                      marginBottom: "32px",
                      margin: "0 0 32px 0",
                    }}>
                      &ldquo;{producer.quote}&rdquo;
                    </blockquote>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.cream}`, paddingTop: "24px" }}>
                      <div>
                        <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.muted }}>Signature Bottle</p>
                        <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.ink, fontWeight: 600 }}>{producer.signature}</p>
                      </div>
                      <Link href="/portfolio" style={{
                        fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
                        color: T.paper, background: T.wine, padding: "12px 24px", borderRadius: "4px", textDecoration: "none", fontWeight: 600
                      }}>
                        Explore →
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §9 — FINAL CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "140px 56px", textAlign: "center", background: T.paper }}>
        <Reveal>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "48px", color: T.ink, marginBottom: "20px" }}>Continue Exploring</h2>
          <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.8 }}>
            Ready to see the full collection? Browse over 100 wines from our global portfolio.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/portfolio" style={{ display: "inline-block", fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: T.paper, background: T.wine, padding: "18px 40px", borderRadius: "4px", textDecoration: "none", fontWeight: 600 }}>
              Explore Full Portfolio
            </Link>
            <Link href="/experiences/rum" style={{ display: "inline-block", fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: T.wine, background: "transparent", border: `1px solid ${T.taupe}`, padding: "18px 40px", borderRadius: "4px", textDecoration: "none" }}>
              Enter House of Rum →
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
