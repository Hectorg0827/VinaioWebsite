"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

/* ── Navigation sections ─────────────────────────────────────────────────── */
const SECTIONS = [
  { id: "origins",    label: "Origins" },
  { id: "barrel",     label: "Barrel Room" },
  { id: "tasting",    label: "How to Taste" },
  { id: "styles",     label: "By Style" },
  { id: "cocktails",  label: "Cocktail Studio" },
  { id: "distillers", label: "Distilleries" },
];

/* ── Content Data ────────────────────────────────────────────────────────── */

const RUM_TIMELINE = [
  { 
    year: "1493", 
    event: "Sugarcane arrives in the New World", 
    detail: "Columbus plants the first sugarcane in Hispaniola. Within decades, sugar plantations spread across the Caribbean, setting the stage for a spirit that would define the region.", 
    inGlass: "Every rum begins with sugarcane — its sweetness is the foundation of the spirit.", 
    brand: null,
    img: "/images/experiences/sugarcane_origins.png"
  },
  { 
    year: "1620s", 
    event: "The first rum is distilled", 
    detail: "Caribbean colonists discover that molasses — a byproduct of sugar production — can be fermented and distilled. The result is raw, potent, and unlike anything produced in Europe.", 
    inGlass: "Unaged white rums still carry this original sugarcane purity.", 
    brand: "Macorix Silver",
    bgImg: "/images/experiences/bg_cabana.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/Macorix%20Silver%20Exportacio%CC%81n.png"
  },
  { 
    year: "1655", 
    event: "The Royal Navy adopts rum", 
    detail: "The British Navy replaces beer rations with rum. The 'tot' becomes a daily ritual for sailors — cementing rum as the spirit of the sea and the tropics.", 
    inGlass: "Navy-strength dark rums preserve this bold, full-bodied tradition.", 
    brand: "Royal Jamaican Blackstrap",
    bgImg: "/images/experiences/bg_pirate.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/Royal%20Jamaican%20Blackstrap%20Dark%20Rum.png"
  },
  { 
    year: "1852", 
    event: "Bermúdez founded in Santo Domingo", 
    detail: "Don Erasmo Bermúdez establishes one of the Dominican Republic's first rum houses. His commitment to quality and barrel aging sets the standard for Dominican rum for the next 170 years.", 
    inGlass: "Bermúdez Añejo carries this founding DNA — rich, complex, and deeply Dominican.", 
    brand: "Bermúdez Ron Añejo",
    img: "/images/experiences/rum_bermudez.png"
  },
  { 
    year: "Early 1900s", 
    event: "The cocktail revolution", 
    detail: "The Daiquiri, the Mojito, the Cuba Libre — bartenders in Havana and beyond discover that rum is the most versatile cocktail spirit. It pairs with citrus, sugar, herbs, and spice like nothing else.", 
    inGlass: "Light, clean rums made for mixing remain essential to every cocktail bar.", 
    brand: "Jamaican Lion Gold",
    bgImg: "/images/experiences/bg_speakeasy.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/Royal%20Jamaican%20-%20Jamaican%20lion%20gold%20rum.png"
  },
  { 
    year: "1970s", 
    event: "Premium rum renaissance begins", 
    detail: "Master blenders apply wine-inspired aging techniques: extended barrel maturation, solera systems, and single-cask releases. Rum begins its journey from party spirit to sipping spirit.", 
    inGlass: "Aged expressions develop dried fruit, tobacco, and cocoa complexity from extra time in oak.", 
    brand: "Bermúdez Añejo",
    img: "/images/experiences/rum_bermudez.png"
  },
  { 
    year: "2000s", 
    event: "Heritage brands meet global demand", 
    detail: "Dominican, Jamaican, and Nepalese distillers begin exporting their finest expressions to discerning markets. Authenticity and provenance become the new luxury.", 
    inGlass: "Spiced and infused rums bring cultural botanicals — cinnamon, allspice, Himalayan herbs — to new audiences.", 
    brand: "Khukri Spiced Rum",
    bgImg: "/images/experiences/bg_himalayan.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/khukri%20rum%20hq.png"
  },
  { 
    year: "Today", 
    event: "Vinaio brings heritage to the US market", 
    detail: "Through direct partnerships with family-owned distilleries, Vinaio imports authentic, unaltered spirits that tell the story of their origin. No additives, no shortcuts — just the barrel, the blender, and the land.", 
    inGlass: "Every bottle in the Vinaio rum portfolio is a direct line to its source — unfiltered and honest.", 
    brand: "Legado Caballo",
    bgImg: "/images/experiences/bg_speakeasy.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/Legado%20caballo.png"
  },
];

const RUM_STYLES = [
  { style: "White Rum", profile: "Clean, light, versatile. The foundation of tropical cocktails.", character: "Sugarcane sweetness, citrus, mineral", use: "Daiquiri, Mojito, Piña Colada", featured: "Macorix Silver", color: "rgba(255,255,255,0.15)" },
  { style: "Gold Rum", profile: "Warm amber hue from brief oak contact. Rounded and smooth.", character: "Vanilla, butterscotch, light oak", use: "Cuba Libre, Rum Punch, sipping neat", featured: "Jamaican Lion Gold", color: "rgba(197,152,63,0.15)" },
  { style: "Aged Rum", profile: "Deep complexity from extended barrel maturation. The sipping class.", character: "Dried fruit, tobacco, cocoa, vanilla", use: "Old Fashioned, neat, on the rocks", featured: "Bermúdez Ron Añejo", color: "rgba(139,69,19,0.15)" },
  { style: "Dark Rum", profile: "Intense, full-bodied, often using molasses-heavy distillation.", character: "Molasses, treacle, burnt sugar, spice", use: "Dark & Stormy, baking, premium mixing", featured: "Royal Jamaican Blackstrap", color: "rgba(60,30,10,0.15)" },
  { style: "Spiced Rum", profile: "Infused with island botanicals, spices, and natural flavors.", character: "Cinnamon, clove, allspice, vanilla", use: "Spiced Mule, hot toddy, cocktail base", featured: "Khukri Spiced Rum", color: "rgba(180,80,30,0.15)" },
];

const TASTING_STEPS = [
  { step: "Nose", instruction: "Bring the glass to your nose gently. Do not inhale too deeply — rum is high in alcohol. Let the aromas come to you.", look: "Vanilla, caramel, tropical fruit, molasses, oak, spice. Aged rums develop leather, tobacco, and dried fruit." },
  { step: "Palate", instruction: "Take a small sip and let it coat your entire tongue. Pay attention to sweetness, warmth, and texture.", look: "Smoothness vs. bite. Sweetness level. Spice intensity. Body — is it light and clean or heavy and coating?" },
  { step: "Finish", instruction: "After swallowing, notice how long the flavors linger and what secondary notes emerge.", look: "Warm oak, lingering spice, dried fruit. A long finish usually indicates quality aging and careful blending." },
];

const COCKTAIL_RECIPES = [
  {
    name: "Classic Daiquiri",
    spirit: "White Rum",
    brand: "Macorix Silver",
    ingredients: ["2 oz white rum", "1 oz fresh lime juice", "¾ oz simple syrup"],
    method: "Shake vigorously with ice. Strain into a chilled coupe glass. Garnish with a lime wheel.",
    bgImg: "/images/experiences/bg_cabana.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/Macorix%20Silver%20Exportacio%CC%81n.png"
  },
  {
    name: "Rum Old Fashioned",
    spirit: "Aged Rum",
    brand: "Bermúdez Ron Añejo",
    ingredients: ["2 oz aged rum", "1 sugar cube", "2 dashes Angostura bitters", "Orange peel"],
    method: "Muddle sugar and bitters. Add rum and a large ice cube. Stir gently for 30 seconds. Express orange peel over the glass.",
    img: "/images/experiences/rum_old_fashioned.png"
  },
  {
    name: "Cuba Libre",
    spirit: "Gold Rum",
    brand: "Jamaican Lion Gold",
    ingredients: ["2 oz gold rum", "4 oz cola", "½ oz fresh lime juice", "Lime wedge"],
    method: "Build in a highball glass over ice. Squeeze lime into the glass; add rum, then cola. Stir gently.",
    bgImg: "/images/experiences/bg_speakeasy.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/Royal%20Jamaican%20-%20Jamaican%20lion%20gold%20rum.png"
  },
  {
    name: "Tropical Punch",
    spirit: "Spiced Rum",
    brand: "Khukri Spiced Rum",
    ingredients: ["1½ oz spiced rum", "2 oz pineapple juice", "1 oz orange juice", "½ oz grenadine"],
    method: "Shake all ingredients with ice. Strain into a tall glass filled with crushed ice. Garnish with pineapple and nutmeg.",
    bgImg: "/images/experiences/bg_himalayan.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/khukri%20rum%20hq.png"
  },
  {
    name: "Premium Sipping Serve",
    spirit: "Aged Rum (12+ Years)",
    brand: "Puntacana Esplendido",
    ingredients: ["2 oz premium aged rum", "1 large clear ice sphere", "Optional: single dash of water"],
    method: "Pour into a crystal tumbler over the ice sphere. Let it sit 30 seconds before your first sip. No garnish needed — let the barrel speak.",
    bgImg: "/images/experiences/bg_speakeasy.png",
    bottleImg: "https://vinaio-bottles-cdn.b-cdn.net/puntacana%20esplendido.png"
  },
];

const DISTILLERY_STORIES = [
  {
    name: "J. Armando Bermúdez",
    founded: "1852",
    location: "Santo Domingo, Dominican Republic",
    heritage: "The oldest continuously operating rum distillery in the Dominican Republic. For over 170 years, the Bermúdez family has perfected the art of tropical barrel aging, producing rums that carry the soul of the island in every drop.",
    signature: "Ron Añejo",
  },
  {
    name: "Puntacana Artisanal Rum",
    founded: "1970s",
    location: "Punta Cana, Dominican Republic",
    heritage: "Born in the resort capital of the Caribbean, Puntacana Rum blends tourism culture with traditional distillation. Their Espléndido expression represents the pinnacle of Dominican hospitality in a bottle.",
    signature: "Espléndido",
  },
  {
    name: "Macorix",
    founded: "Dominican Heritage",
    location: "San Pedro de Macorís, Dominican Republic",
    heritage: "Named after the legendary sugar-producing city, Macorix produces rums that honor the connection between sugarcane and spirit. Their Añejo and Silver expressions cover the full spectrum of Dominican rum craft.",
    signature: "Añejo Premium",
  },
  {
    name: "Kalembú",
    founded: "Dominican Tradition",
    location: "Dominican Republic",
    heritage: "A modern expression of Dominican mamajuana culture, Kalembú bridges the gap between traditional herbal infusions and contemporary premium spirits. Their 18-year expression is a collector's benchmark.",
    signature: "Kalembú 18",
  },
];

/* ── Sticky Subnav ───────────────────────────────────────────────────────── */
function StickySubnav({ sections, activeSection }) {
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 800,
      background: "rgba(10,10,10,0.95)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
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
              color: activeSection === s.id ? "#FFFFFF" : "rgba(255,255,255,0.45)",
              borderBottom: activeSection === s.id ? "2px solid #FFFFFF" : "2px solid transparent",
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
export default function HouseOfRumPage() {
  const [activeSection, setActiveSection] = useState("origins");
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
    <main style={{ background: T.ink, minHeight: "100vh", color: T.paper }}>
      <style>{`
        .rum-section { padding: 120px 56px; }
        .timeline-grid { display: grid; grid-template-columns: 1fr 200px; gap: 32px; align-items: start; }
        .cocktail-grid {
          display: grid;
          gap: 0;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
        }
        .cocktail-grid-even { grid-template-columns: 300px 1fr; }
        .cocktail-grid-odd { grid-template-columns: 1fr 300px; }

        @media (max-width: 1024px) {
          .rum-section { padding: 80px 24px !important; }
        }

        @media (max-width: 768px) {
          .rum-section { padding: 60px 20px !important; }
          .timeline-grid { grid-template-columns: 1fr; }
          .timeline-brand-box { padding: 16px !important; }
          .cocktail-grid { grid-template-columns: 1fr !important; }
          .cocktail-img-box { height: 260px !important; order: 0 !important; }
          .cocktail-content-box { order: 1 !important; padding: 24px !important; }
          .distillery-card { padding: 24px !important; }
        }
      `}</style>

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
          src="/images/experiences/rum_experience.png"
          alt="Vinaio House of Rum"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 0%, ${T.ink} 100%)` }} />

        <div style={{ position: "relative", textAlign: "center", padding: "0 20px", zIndex: 10 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
              <Hr w="40px" c={T.gold} />
              <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold }}>
                Heritage & Craft
              </span>
              <Hr w="40px" c={T.gold} />
            </div>
            <h1 style={{
              fontFamily: ff.h,
              fontSize: "clamp(48px, 8vw, 100px)",
              color: T.paper,
              lineHeight: 1,
              marginBottom: "32px",
              fontWeight: 400
            }}>
              Vinaio House of Rum
            </h1>
            <p style={{
              fontFamily: ff.b,
              fontSize: "17px",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "650px",
              margin: "0 auto 48px",
              lineHeight: 1.7,
              letterSpacing: "0.5px"
            }}>
              From the sugarcane fields of Hispaniola to the barrel rooms of Santo Domingo — discover the craft, culture, and spirits that define the Vinaio rum portfolio.
            </p>
            <a
              href="#origins"
              onClick={(e) => { e.preventDefault(); document.getElementById("origins")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                display: "inline-block",
                fontFamily: ff.b,
                fontSize: "10px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: T.gold,
                border: `1px solid ${T.gold}40`,
                padding: "16px 40px",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
            >
              Begin the Journey
            </a>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §2 — STICKY SUBNAV
      ══════════════════════════════════════════════════════════════════ */}
      {showNav && <StickySubnav sections={SECTIONS} activeSection={activeSection} />}

      {/* ══════════════════════════════════════════════════════════════════
          §3 — THE ORIGINS OF RUM
      ══════════════════════════════════════════════════════════════════ */}
      <section id="origins" className="rum-section" style={{ background: T.ink }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "20px" }}>
              The Origins of Rum
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: 1.8, marginBottom: "80px" }}>
              Rum was not invented — it was discovered. In the heat and humidity of the Caribbean, sugarcane juice fermented naturally, and colonists learned to capture its spirit in copper stills. This is that story.
            </p>
          </Reveal>

          {/* Timeline */}
          <div style={{ position: "relative", paddingLeft: "40px" }}>
            <div style={{ position: "absolute", left: "12px", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,0.1)" }} />

            {RUM_TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.1}>
                <div style={{ marginBottom: "80px", position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    left: "-34px",
                    top: "6px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: T.gold,
                    boxShadow: `0 0 20px ${T.gold}40`,
                  }} />
                  
                  <div className="timeline-grid">
                    <div>
                      <p style={{ fontFamily: ff.b, fontSize: "12px", letterSpacing: "3px", color: T.gold, marginBottom: "8px", fontWeight: 700 }}>
                        {item.year}
                      </p>
                      <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "16px" }}>
                        {item.event}
                      </h3>
                      <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "20px" }}>
                        {item.detail}
                      </p>
                    </div>
                    {item.bgImg && item.bottleImg ? (
                      <div style={{ position: "relative", height: "180px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <img src={item.bgImg} alt="Background" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, filter: "brightness(0.7)" }} />
                        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyItems: "center", padding: "10px" }}>
                             <img src={item.bottleImg} alt={item.event} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.8))" }} />
                        </div>
                      </div>
                    ) : item.img ? (
                      <div style={{ height: "180px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", background: item.img.includes('b-cdn.net') ? 'transparent' : 'rgba(255,255,255,0.02)', display: "flex", alignItems: "center", justifyContent: "center", padding: item.img.includes('b-cdn.net') ? '10px' : '0' }}>
                        <img src={item.img} alt={item.event} style={{ width: "100%", height: "100%", objectFit: item.img.includes('b-cdn.net') ? "contain" : "cover" }} />
                      </div>
                    ) : null}
                  </div>

                  <div className="timeline-brand-box" style={{ 
                    padding: "24px", 
                    background: "rgba(255,255,255,0.06)", 
                    borderRadius: "12px", 
                    borderLeft: `2px solid ${T.gold}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.4)", fontStyle: "italic", lineHeight: 1.6 }}>
                      <strong style={{ color: T.gold, textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px", fontStyle: "normal", marginRight: "8px" }}>In the Glass:</strong>
                      {item.inGlass}
                    </p>
                    {item.brand && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                        <span style={{ fontFamily: ff.b, fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Related Vinaio Spirit:</span>
                        <Link href="/portfolio" style={{ fontFamily: ff.b, fontSize: "13px", color: T.gold, textDecoration: "none", borderBottom: `1px solid ${T.gold}80`, paddingBottom: "2px" }}>
                          {item.brand} →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §4 — THE BARREL ROOM
      ══════════════════════════════════════════════════════════════════ */}
      <section id="barrel" className="rum-section" style={{ background: T.ink, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 100%, rgba(194,163,85,0.12) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "20px" }}>
              The Barrel Room
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              In the Caribbean, barrels breathe faster. The tropical heat accelerates the exchange between spirit and wood, producing in 5 years what might take 15 in Scotland. This is tropical maturation — and it is the secret behind Dominican rum&apos;s depth.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { title: "American Oak", detail: "The workhorse barrel. Previously used for bourbon, it imparts vanilla, caramel, and coconut notes.", icon: "🪵" },
              { title: "Tropical Aging", detail: "Caribbean heat causes 6-8% 'angel's share' per year — far more than temperate climates. Every year matters.", icon: "🌡️" },
              { title: "Solera System", detail: "A fractional blending method where young rum is gradually married with older stock, creating extraordinary complexity.", icon: "⚗️" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "40px 32px",
                  transition: "border-color 0.3s",
                  height: "100%",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                >
                  <div style={{ fontSize: "28px", marginBottom: "20px" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "22px", color: T.gold, marginBottom: "12px" }}>{item.title}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §5 — HOW TO TASTE RUM
      ══════════════════════════════════════════════════════════════════ */}
      <section id="tasting" className="rum-section" style={{ background: T.ink }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "20px" }}>
              How to Taste Rum
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Rum is often consumed casually, but its complexity rivals any whisky or cognac. Slowing down reveals a world of flavor most people miss.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {TASTING_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "32px",
                  padding: "48px 0",
                  borderBottom: i < TASTING_STEPS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  alignItems: "start",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      color: T.gold,
                      fontFamily: ff.h,
                      fontSize: "56px",
                      lineHeight: 1,
                      marginBottom: "8px",
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.gold }}>
                      {step.step}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.paper, lineHeight: 1.7, marginBottom: "16px" }}>
                      {step.instruction}
                    </p>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                      <strong style={{ color: "rgba(255,255,255,0.6)" }}>What to look for:</strong> {step.look}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §6 — RUM BY STYLE
      ══════════════════════════════════════════════════════════════════ */}
      <section id="styles" className="rum-section" style={{ background: T.ink }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "20px" }}>
              Rum by Style
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Not all rum is created equal. From crystalline whites to velvety aged expressions, each style serves a different purpose and palate.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {RUM_STYLES.map((rum, i) => (
              <Reveal key={rum.style} delay={i * 0.08}>
                <div style={{
                  background: rum.color,
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                >
                  <div style={{ padding: "32px 24px", flexGrow: 1 }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "22px", color: T.paper, marginBottom: "12px" }}>{rum.style}</h3>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "16px" }}>{rum.profile}</p>

                    <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>Character</p>
                    <p style={{ fontFamily: ff.b, fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "16px", fontStyle: "italic" }}>{rum.character}</p>

                    <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>Best for</p>
                    <p style={{ fontFamily: ff.b, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{rum.use}</p>
                  </div>

                  <div style={{ background: "rgba(194,163,85,0.12)", padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.gold, marginBottom: "2px" }}>Vinaio Pick</p>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.paper, fontWeight: 600 }}>{rum.featured}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §7 — COCKTAIL STUDIO
      ══════════════════════════════════════════════════════════════════ */}
      <section id="cocktails" className="rum-section" style={{ background: T.ink }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "20px" }}>
              The Cocktail Studio
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Five signature serves — from the timeless Daiquiri to the contemplative sipping ritual. Each paired with a Vinaio rum recommendation.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {COCKTAIL_RECIPES.map((cocktail, i) => (
              <Reveal key={cocktail.name} delay={i * 0.08}>
                <div className={`cocktail-grid ${i % 2 === 0 ? "cocktail-grid-even" : "cocktail-grid-odd"}`}>
                  <div className="cocktail-img-box" style={{ order: i % 2 === 0 ? 0 : 1, height: "320px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)", position: "relative", overflow: "hidden" }}>
                    {cocktail.bgImg ? (
                      <>
                        <img src={cocktail.bgImg} alt="Bar Setting" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, filter: "brightness(0.6)" }} />
                        <div style={{ position: "absolute", inset: 0, zIndex: 2, padding: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={cocktail.bottleImg} alt={cocktail.name} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.9))" }} />
                        </div>
                      </>
                    ) : (
                      <img src={cocktail.img} alt={cocktail.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <div className="cocktail-content-box" style={{ order: i % 2 === 0 ? 1 : 0, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.gold, marginBottom: "12px" }}>
                      {cocktail.spirit} · {cocktail.brand}
                    </p>
                    <h3 style={{ fontFamily: ff.h, fontSize: "32px", color: T.paper, marginBottom: "20px" }}>{cocktail.name}</h3>

                    <div style={{ marginBottom: "20px" }}>
                      {cocktail.ingredients.map(ing => (
                        <p key={ing} style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.5)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                          {ing}
                        </p>
                      ))}
                    </div>

                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontStyle: "italic" }}>
                      {cocktail.method}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §8 — DISTILLERY STORIES
      ══════════════════════════════════════════════════════════════════ */}
      <section id="distillers" className="rum-section" style={{ background: T.ink }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "20px" }}>
              The Distilleries Behind Our Portfolio
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Vinaio does not just import rum. We partner with the families, blenders, and master distillers who have been shaping Caribbean spirit culture for generations.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {DISTILLERY_STORIES.map((dist, i) => (
              <Reveal key={dist.name} delay={i * 0.1}>
                <div className="distillery-card" style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  padding: "48px",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "32px", color: T.paper }}>{dist.name}</h3>
                    <span style={{ fontFamily: ff.b, fontSize: "12px", color: T.gold }}>Est. {dist.founded}</span>
                  </div>
                  <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>
                    {dist.location}
                  </p>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "24px" }}>
                    {dist.heritage}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
                    <div>
                      <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Signature Expression</p>
                      <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.gold, fontWeight: 600 }}>{dist.signature}</p>
                    </div>
                    <Link href="/portfolio" style={{
                      fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
                      color: T.ink, background: T.gold, padding: "12px 24px", borderRadius: "4px", textDecoration: "none", fontWeight: 600
                    }}>
                      Explore →
                    </Link>
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
      <section className="rum-section" style={{ textAlign: "center", background: T.ink }}>
        <Reveal>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "48px", color: T.paper, marginBottom: "20px" }}>Continue Exploring</h2>
          <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.8 }}>
            Browse the full Vinaio spirits and rum portfolio — or discover our world of wines.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/portfolio" style={{ display: "inline-block", fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: T.ink, background: T.gold, padding: "18px 40px", borderRadius: "4px", textDecoration: "none", fontWeight: 600 }}>
              Explore Full Portfolio
            </Link>
            <Link href="/experiences/wine" style={{ display: "inline-block", fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: T.gold, background: "transparent", border: `1px solid ${T.gold}40`, padding: "18px 40px", borderRadius: "4px", textDecoration: "none" }}>
              Enter World of Wines →
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
