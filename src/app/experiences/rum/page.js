"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import ExperienceVideoSection from "@/components/ExperienceVideoSection";

/* ── Navigation sections ─────────────────────────────────────────────────── */
const SECTIONS = [
  { id: "origins",    label: "Origins" },
  { id: "videos",     label: "Videos" },
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
      background: "rgba(255,253,249,0.95)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${T.taupe}`,
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
export default function HouseOfRumPage() {
  const [activeSection, setActiveSection] = useState("origins");
  const [showNav, setShowNav] = useState(false);
  const [barrelModal, setBarrelModal] = useState(null);

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
    <main style={{ background: T.bg, minHeight: "100vh", color: T.ink }}>
      <style>{`
        .rum-section { padding: 120px 56px; }
        .timeline-grid { display: grid; grid-template-columns: 1fr 200px; gap: 32px; align-items: start; }
        .cocktail-grid {
          display: grid;
          gap: 0;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid ${T.cream};
          background: ${T.paper};
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
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

      {/* 1 — HERO (Remains dark for mystique, but fades to site bg) */}
      <section style={{
        height: "85vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: T.ink
      }}>
        <img
          src="/images/experiences/rum_experience.png"
          alt="Vinaio House of Rum"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 0%, ${T.bg} 100%)` }} />

        <div style={{ position: "relative", textAlign: "center", padding: "0 20px", zIndex: 10 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
              <Hr w="40px" c={T.gold} />
              <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold, fontWeight: 700 }}>
                Heritage & Craft
              </span>
              <Hr w="40px" c={T.gold} />
            </div>
            <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ 
                fontFamily: "Georgia, serif", 
                fontSize: "clamp(48px, 8vw, 80px)", 
                color: T.wine, 
                letterSpacing: "12px", 
                lineHeight: 1,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center"
              }}>
                V I N <span style={{ display: "inline-block", transform: "scaleY(1.1)", margin: "0 4px" }}>Λ</span> I O
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%", maxWidth: "420px" }}>
                <div style={{ flex: 1, height: "1px", background: T.wine }} />
                <span style={{ 
                  fontFamily: "Georgia, serif", 
                  fontSize: "15px", 
                  letterSpacing: "4px", 
                  color: T.wine,
                  textTransform: "uppercase"
                }}>
                  House of Rum
                </span>
                <div style={{ flex: 1, height: "1px", background: T.wine }} />
              </div>
            </div>
            <p style={{
              fontFamily: ff.b,
              fontSize: "17px",
              color: T.deep,
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
                color: "white",
                background: T.wine,
                padding: "18px 48px",
                textDecoration: "none",
                transition: "all 0.3s",
                borderRadius: "4px",
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(114, 47, 55, 0.2)"
              }}
            >
              Begin the Journey
            </a>
          </Reveal>
        </div>
      </section>

      {/* 2 — STICKY SUBNAV */}
      {showNav && <StickySubnav sections={SECTIONS} activeSection={activeSection} />}

      {/* 3 — THE ORIGINS OF RUM */}
      <section id="origins" className="rum-section" style={{ background: T.bg }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              The Origins of Rum
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "80px" }}>
              Rum was not invented — it was discovered. In the heat and humidity of the Caribbean, sugarcane juice fermented naturally, and colonists learned to capture its spirit in copper stills.
            </p>
          </Reveal>

          {/* Timeline */}
          <div style={{ position: "relative", paddingLeft: "40px" }}>
            <div style={{ position: "absolute", left: "12px", top: 0, bottom: 0, width: "2px", background: T.taupe }} />

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
                  }} />
                  
                  <div className="timeline-grid">
                    <div>
                      <p style={{ fontFamily: ff.b, fontSize: "12px", letterSpacing: "3px", color: T.wine, marginBottom: "8px", fontWeight: 700 }}>
                        {item.year}
                      </p>
                      <h3 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "16px" }}>
                        {item.event}
                      </h3>
                      <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.deep, lineHeight: 1.8, marginBottom: "20px" }}>
                        {item.detail}
                      </p>
                    </div>
                    {item.bgImg && item.bottleImg ? (
                      <div style={{ position: "relative", height: "180px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${T.cream}` }}>
                        <img src={item.bgImg} alt="Background" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, filter: "brightness(0.9)" }} />
                        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyItems: "center", padding: "10px" }}>
                             <img src={item.bottleImg} alt={item.event} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }} />
                        </div>
                      </div>
                    ) : item.img ? (
                      <div style={{ height: "180px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${T.cream}`, background: T.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={item.img} alt={item.event} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : null}
                  </div>

                  <div className="timeline-brand-box" style={{ 
                    padding: "24px", 
                    background: T.paper, 
                    borderRadius: "12px", 
                    border: `1px solid ${T.cream}`,
                    borderLeft: `3px solid ${T.wine}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
                  }}>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, fontStyle: "italic", lineHeight: 1.6 }}>
                      <strong style={{ color: T.wine, textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px", fontStyle: "normal", marginRight: "8px" }}>In the Glass:</strong>
                      {item.inGlass}
                    </p>
                    {item.brand && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                        <span style={{ fontFamily: ff.b, fontSize: "10px", color: T.warm, textTransform: "uppercase", letterSpacing: "1px" }}>Related Vinaio Spirit:</span>
                        <Link href="/portfolio" style={{ fontFamily: ff.b, fontSize: "13px", color: T.wine, textDecoration: "none", borderBottom: `1px solid ${T.wine}40`, fontWeight: 600 }}>
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

      {/* 3.5 — VISUAL STORIES */}
      <ExperienceVideoSection experience="rum" />

      {/* 4 — THE BARREL ROOM (Stays dark for cellar vibe, but refined) */}
      <section id="barrel" className="rum-section" style={{ background: T.ink, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 100%, rgba(194,163,85,0.15) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "20px" }}>
              The Barrel Room
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              In the Caribbean, barrels breathe faster. The tropical heat accelerates the exchange between spirit and wood, producing in 5 years what might take 15 in Scotland. This is tropical maturation.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { 
                title: "American Oak", 
                detail: "The workhorse barrel. Previously used for bourbon, it imparts vanilla, caramel, and coconut notes.", 
                icon: "🪵",
                expandedDetail: "Ex-bourbon American Oak (Quercus alba) is the global standard for rum maturation. The tight grain and char level from its previous life impart rich lactones (coconut) and vanillins (vanilla). Because it previously held bourbon, the harsh tannins have already been extracted, allowing the rum to age smoothly without becoming overly astringent.",
                stats: [
                  { label: "Wood Origin", value: "Missouri / Kentucky, USA" },
                  { label: "Key Flavors", value: "Vanilla, Caramel, Coconut, Baking Spice" },
                  { label: "Char Level", value: "Typically #3 or #4 (Alligator Char)" }
                ]
              },
              { 
                title: "Tropical Aging", 
                detail: "Caribbean heat causes 6-8% 'angel's share' per year — far more than temperate climates. Every year matters.", 
                icon: "🌡️",
                expandedDetail: "In the Caribbean, barrels breathe faster. High heat and humidity cause the pores of the oak to expand, accelerating the extraction of flavor compounds and the esterification process. A rum aged for 5 years in the Dominican Republic can extract as much oak character as a Scotch whisky aged for 15 years in temperate climates.",
                stats: [
                  { label: "Angel's Share", value: "6% - 8% Annually (vs 2% in Scotland)" },
                  { label: "Maturation Speed", value: "Roughly 2.5x to 3x faster than temperate" },
                  { label: "Profile Impact", value: "Intense, rapid flavor integration" }
                ]
              },
              { 
                title: "Solera System", 
                detail: "A fractional blending method where young rum is gradually married with older stock, creating extraordinary complexity.", 
                icon: "⚗️",
                expandedDetail: "Originally developed for sherry, the Solera system stacks barrels in tiers (criaderas). As rum is drawn from the bottom tier (the solera) for bottling, it is replenished with slightly younger rum from the tier above. This creates a fractional blend that ensures absolute consistency and a cascading complexity where the 'mother' rum lives forever.",
                stats: [
                  { label: "Method", value: "Fractional Blending" },
                  { label: "Age Statements", value: "Typically represents the oldest drop in the blend" },
                  { label: "Benefit", value: "Unmatched consistency year over year" }
                ]
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  padding: "48px 32px",
                  transition: "all 0.3s ease",
                  height: "100%",
                  textAlign: "center",
                  cursor: "pointer"
                }}
                onClick={() => setBarrelModal(item)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = T.gold;
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "24px" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.gold, marginBottom: "16px" }}>{item.title}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — HOW TO TASTE RUM */}
      <section id="tasting" className="rum-section" style={{ background: T.paper }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              How to Taste Rum
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Rum complexity rivals any whisky or cognac. Slowing down reveals a world of flavor most people miss.
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
                  borderBottom: i < TASTING_STEPS.length - 1 ? `1px solid ${T.cream}` : "none",
                  alignItems: "start",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      color: T.wine,
                      fontFamily: ff.h,
                      fontSize: "64px",
                      lineHeight: 1,
                      marginBottom: "8px",
                    }}>
                      0{i + 1}
                    </div>
                    <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.wine, fontWeight: 700 }}>
                      {step.step}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: ff.b, fontSize: "17px", color: T.ink, lineHeight: 1.7, marginBottom: "16px", fontWeight: 500 }}>
                      {step.instruction}
                    </p>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, lineHeight: 1.6 }}>
                      <strong style={{ color: T.deep }}>What to look for:</strong> {step.look}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — RUM BY STYLE */}
      <section id="styles" className="rum-section" style={{ background: T.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              Rum by Style
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              From crystalline whites to velvety aged expressions, each style serves a different purpose and palate.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {RUM_STYLES.map((rum, i) => (
              <Reveal key={rum.style} delay={i * 0.08}>
                <div style={{
                  background: T.paper,
                  border: `1px solid ${T.cream}`,
                  borderRadius: "20px",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = T.gold;
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.cream;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <div style={{ padding: "32px 24px", flexGrow: 1 }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "12px" }}>{rum.style}</h3>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, lineHeight: 1.6, marginBottom: "20px" }}>{rum.profile}</p>

                    <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginBottom: "6px", fontWeight: 700 }}>Character</p>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.deep, marginBottom: "20px", fontStyle: "italic" }}>{rum.character}</p>

                    <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginBottom: "6px", fontWeight: 700 }}>Best for</p>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.deep }}>{rum.use}</p>
                  </div>

                  <div style={{ background: `${T.gold}10`, padding: "16px 24px", borderTop: `1px solid ${T.cream}` }}>
                    <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.gold, marginBottom: "4px", fontWeight: 700 }}>Vinaio Pick</p>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.wine, fontWeight: 700 }}>{rum.featured}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — COCKTAIL STUDIO */}
      <section id="cocktails" className="rum-section" style={{ background: T.cream }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              The Cocktail Studio
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Five signature serves — from the timeless Daiquiri to the contemplative sipping ritual.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {COCKTAIL_RECIPES.map((cocktail, i) => (
              <Reveal key={cocktail.name} delay={i * 0.08}>
                <div className={`cocktail-grid ${i % 2 === 0 ? "cocktail-grid-even" : "cocktail-grid-odd"}`}>
                  <div className="cocktail-img-box" style={{ order: i % 2 === 0 ? 0 : 1, height: "350px", display: "flex", alignItems: "center", justifyContent: "center", background: T.ink, position: "relative", overflow: "hidden" }}>
                    {cocktail.bgImg ? (
                      <>
                        <img src={cocktail.bgImg} alt="Bar Setting" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, filter: "brightness(0.6)" }} />
                        <div style={{ position: "absolute", inset: 0, zIndex: 2, padding: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={cocktail.bottleImg} alt={cocktail.name} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.4))" }} />
                        </div>
                      </>
                    ) : (
                      <img src={cocktail.img} alt={cocktail.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <div className="cocktail-content-box" style={{ order: i % 2 === 0 ? 1 : 0, padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: T.wine, marginBottom: "16px", fontWeight: 700 }}>
                      {cocktail.spirit} · {cocktail.brand}
                    </p>
                    <h3 style={{ fontFamily: ff.h, fontSize: "36px", color: T.ink, marginBottom: "24px" }}>{cocktail.name}</h3>

                    <div style={{ marginBottom: "24px" }}>
                      {cocktail.ingredients.map(ing => (
                        <p key={ing} style={{ fontFamily: ff.b, fontSize: "14px", color: T.deep, padding: "6px 0", borderBottom: `1px solid ${T.taupe}30` }}>
                          {ing}
                        </p>
                      ))}
                    </div>

                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, lineHeight: 1.7, fontStyle: "italic" }}>
                      {cocktail.method}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — DISTILLERY STORIES */}
      <section id="distillers" className="rum-section" style={{ background: T.bg }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "28px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "20px" }}>
              Distillery Heritage
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "64px" }}>
              Vinaio partners with the families, blenders, and master distillers who have been shaping Caribbean spirit culture for generations.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {DISTILLERY_STORIES.map((dist, i) => (
              <Reveal key={dist.name} delay={i * 0.1}>
                <div className="distillery-card" style={{
                  background: T.paper,
                  border: `1px solid ${T.cream}`,
                  borderRadius: "24px",
                  padding: "56px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.wine}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.cream}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "36px", color: T.ink }}>{dist.name}</h3>
                    <span style={{ fontFamily: ff.b, fontSize: "14px", color: T.wine, fontWeight: 700 }}>Est. {dist.founded}</span>
                  </div>
                  <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, marginBottom: "24px", fontWeight: 700 }}>
                    {dist.location}
                  </p>
                  <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.deep, lineHeight: 1.8, marginBottom: "32px" }}>
                    {dist.heritage}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.cream}`, paddingTop: "24px", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                      <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginBottom: "4px" }}>Signature Expression</p>
                      <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.wine, fontWeight: 700 }}>{dist.signature}</p>
                    </div>
                    <Link href="/portfolio" style={{
                      fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase",
                      color: "white", background: T.ink, padding: "14px 32px", borderRadius: "4px", textDecoration: "none", fontWeight: 700
                    }}>
                      View Collection →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9 — FINAL CTA */}
      <section className="rum-section" style={{ textAlign: "center", background: T.wineMetal, color: "white" }}>
        <Reveal>
          <Hr w="40px" c={T.gold} style={{ margin: "0 auto 32px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "56px", color: "white", marginBottom: "24px" }}>Continue the Journey</h2>
          <p style={{ fontFamily: ff.b, fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "550px", margin: "0 auto 48px", lineHeight: 1.8 }}>
            Browse the full Vinaio spirits portfolio or immerse yourself in our world of wines.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/portfolio" style={{ display: "inline-block", fontFamily: ff.b, fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: T.wine, background: "white", padding: "20px 48px", borderRadius: "4px", textDecoration: "none", fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
              Full Portfolio
            </Link>
            <Link href="/experiences/wine" style={{ display: "inline-block", fontFamily: ff.b, fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: "white", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", padding: "20px 48px", borderRadius: "4px", textDecoration: "none", fontWeight: 700 }}>
              World of Wines →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* BARREL ROOM MODAL */}
      {barrelModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          padding: "20px"
        }}
        onClick={() => setBarrelModal(null)}
        >
          <div style={{
            background: T.ink,
            border: `1px solid ${T.gold}`,
            borderRadius: "24px",
            maxWidth: "700px",
            width: "100%",
            padding: "48px",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
          }}
          onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setBarrelModal(null)}
              style={{ position: "absolute", top: "24px", right: "24px", background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer", outline: "none" }}
            >
              ✕
            </button>
            <div style={{ fontSize: "48px", marginBottom: "24px", textAlign: "center" }}>{barrelModal.icon}</div>
            <h3 style={{ fontFamily: ff.h, fontSize: "36px", color: T.gold, marginBottom: "24px", textAlign: "center" }}>{barrelModal.title}</h3>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: "40px", textAlign: "center" }}>
              {barrelModal.expandedDetail}
            </p>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "24px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.gold, marginBottom: "16px", textAlign: "center" }}>Technical Specs</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {barrelModal.stats.map(stat => (
                  <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
                    <span style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{stat.label}</span>
                    <span style={{ fontFamily: ff.b, fontSize: "13px", color: "white", fontWeight: 600, textAlign: "right" }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
