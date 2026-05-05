"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import GrapeCard from "./GrapeCard";
import GrapeDetailDrawer from "./GrapeDetailDrawer";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";

/* ── Fallback Seed Data ────────────────────────────────────────────────────
   Used when the Supabase `grapes` table doesn't exist or is unreachable. */
const SEED_GRAPES = [
  { id: "tempranillo", name: "Tempranillo", color: "Red", body: "Medium–Full", acidity: "Medium", profile: { fruit: "Cherry", earth: "Leather", oak: "Vanilla", other: "Tobacco" }, description: "Spain's noble grape, known for longevity and structure.", food_pairings: ["Grilled lamb", "Aged cheeses", "Charcuterie"], tech_sheet: { soil: "Chalky-clay", climate: "Continental" }, is_featured: true, regions: ["Ribera del Duero", "Rioja"] },
  { id: "albarino", name: "Albariño", color: "White", body: "Light–Medium", acidity: "High", profile: { fruit: "Peach", earth: "Saline", oak: "None", other: "Citrus" }, description: "Crisp, aromatic white from the Atlantic coast.", food_pairings: ["Oysters", "Ceviche", "Grilled fish"], tech_sheet: { soil: "Granite", climate: "Maritime" }, is_featured: true, regions: ["Rías Baixas"] },
  { id: "cabernet-sauvignon", name: "Cabernet Sauvignon", color: "Red", body: "Full", acidity: "Medium–High", profile: { fruit: "Blackcurrant", earth: "Graphite", oak: "Cedar", other: "Bell pepper" }, description: "The global king of reds, structured and powerful.", food_pairings: ["Ribeye steak", "Short ribs", "Dark chocolate"], tech_sheet: { soil: "Gravel", climate: "Warm" }, is_featured: true, regions: ["Stellenbosch", "Mendoza", "Napa Valley"] },
  { id: "garnacha", name: "Garnacha", color: "Red", body: "Medium–Full", acidity: "Medium", profile: { fruit: "Raspberry", earth: "Garrigue", oak: "Neutral", other: "White pepper" }, description: "Versatile and plush, the backbone of many Mediterranean blends.", food_pairings: ["Paella", "Roasted vegetables", "Grilled sausage"], tech_sheet: { soil: "Schist", climate: "Hot" }, is_featured: true, regions: ["La Mancha", "Priorat"] },
  { id: "verdejo", name: "Verdejo", color: "White", body: "Light–Medium", acidity: "High", profile: { fruit: "Lime", earth: "Fennel", oak: "None", other: "White flowers" }, description: "Highly aromatic Spanish white with characteristic bitter finish.", food_pairings: ["Tapas", "Goat cheese", "Asparagus"], tech_sheet: { soil: "Gravel", climate: "Dry continental" }, is_featured: true, regions: ["Rueda"] },
  { id: "chenin-blanc", name: "Chenin Blanc", color: "White", body: "Medium", acidity: "High", profile: { fruit: "Quince", earth: "Wet stone", oak: "Honey", other: "Yellow apple" }, description: "Highly versatile grape known for range from bone-dry to sweet.", food_pairings: ["Thai curry", "Roasted pork", "Apple tart"], tech_sheet: { soil: "Shale", climate: "Moderate" }, is_featured: true, regions: ["Western Cape", "Loire Valley"] },
  { id: "sangiovese", name: "Sangiovese", color: "Red", body: "Medium–Full", acidity: "High", profile: { fruit: "Sour cherry", earth: "Dried herbs", oak: "Spice", other: "Tomato leaf" }, description: "The soul of Tuscany, vibrant with acidity and earthy charm.", food_pairings: ["Pasta al ragù", "Pizza", "Hard cheeses"], tech_sheet: { soil: "Clay-limestone", climate: "Mediterranean" }, is_featured: true, regions: ["Tuscany", "Umbria"] },
  { id: "malbec", name: "Malbec", color: "Red", body: "Full", acidity: "Medium", profile: { fruit: "Plum", earth: "Cocoa", oak: "Mocha", other: "Violet" }, description: "Argentina's signature grape, rich and velvety at altitude.", food_pairings: ["Grilled beef", "Empanadas", "Blue cheese"], tech_sheet: { soil: "Alluvial", climate: "High-altitude continental" }, is_featured: true, regions: ["Mendoza", "Cahors"] },
  { id: "tannat", name: "Tannat", color: "Red", body: "Full", acidity: "Medium–High", profile: { fruit: "Blackberry", earth: "Graphite", oak: "Smoke", other: "Dried plum" }, description: "Originally from France, Tannat has become the national grape of Uruguay. Known for its intense tannins and high antioxidant content.", food_pairings: ["Barbecued meats", "Strong cheeses", "Cassoulet"], tech_sheet: { soil: "Clay-loam", climate: "Maritime" }, is_featured: true, regions: ["Uruguay", "Canelones", "Madiran"] },
  { id: "koshu", name: "Koshu", color: "White", body: "Light", acidity: "High", profile: { fruit: "Yuzu", earth: "Saline", oak: "None", other: "White pepper" }, description: "Japan's primary indigenous wine grape. Produces delicate, elegant wines that reflect the volcanic terroir of Yamanashi.", food_pairings: ["Sushi", "Sashimi", "Tempura"], tech_sheet: { soil: "Volcanic", climate: "Humid monsoon" }, is_featured: true, regions: ["Yamanashi", "Japan"] },
  { id: "saperavi", name: "Saperavi", color: "Red", body: "Full", acidity: "High", profile: { fruit: "Pomegranate", earth: "Beetroot", oak: "Spice", other: "Leather" }, description: "A 'teinturier' grape from Georgia (the birthplace of wine), meaning both skin and flesh are red. Produces deep, ink-colored wines with massive longevity.", food_pairings: ["Khinkali", "Grilled kebabs", "Walnut dishes"], tech_sheet: { soil: "Alluvial", climate: "Moderate continental" }, is_featured: true, regions: ["Kakheti", "Georgia"] },
  { id: "riesling", name: "Riesling", color: "White", body: "Light–Medium", acidity: "Very High", profile: { fruit: "Lime", earth: "Petrol", oak: "None", other: "Honeysuckle" }, description: "The aromatic king of cool climates. Expresses terroir more precisely than almost any other grape.", food_pairings: ["Spicy Thai food", "Saucisson", "Goat cheese"], tech_sheet: { soil: "Slate", climate: "Cool continental" }, is_featured: true, regions: ["Mosel", "Alsace", "Rheingau", "Eden Valley", "Finger Lakes"] },
];

/* ── Static Mapping (Fallback) ───────────────────────────────────────────── */
const COUNTRY_REGION_MAP = {
  "Spain": ["Ribera del Duero", "Rioja", "La Mancha", "Priorat", "Rueda", "Rías Baixas", "Jerez"],
  "Italy": ["Tuscany", "Umbria", "Piedmont", "Veneto", "Sicily", "Puglia"],
  "France": ["Loire Valley", "Bordeaux", "Burgundy", "Cahors", "Champagne", "Rhône"],
  "USA": ["Napa Valley", "Sonoma", "Willamette Valley", "Finger Lakes"],
  "Argentina": ["Mendoza", "Salta", "Patagonia"],
  "Chile": ["Maipo Valley", "Colchagua", "Atacama", "Casablanca"],
  "South Africa": ["Stellenbosch", "Western Cape", "Swartland"],
  "Portugal": ["Douro", "Alentejo", "Vinho Verde", "Dão"],
};

export default function GrapeLibrary({ selectedRegionName = null }) {
  const [grapes, setGrapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localRegion, setLocalRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeColor, setActiveColor] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All"); // New Region Filter
  const [selectedGrape, setSelectedGrape] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10); // Pagination

  // Sync internal state with external prop (the map selection)
  useEffect(() => {
    if (selectedRegionName) {
      setLocalRegion(selectedRegionName);
    }
  }, [selectedRegionName]);

  useEffect(() => {
    const fetchGrapes = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("grapes").select("*");
        if (!error && data && data.length > 0) {
          setGrapes(data);
        } else {
          setGrapes(SEED_GRAPES);
        }
      } catch {
        setGrapes(SEED_GRAPES);
      }
      setLoading(false);
    };
    fetchGrapes();
  }, []);

  const filteredGrapes = grapes.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesRegion = true;
    // Map selection filter
    if (localRegion) {
      const mappedRegions = COUNTRY_REGION_MAP[localRegion] || [localRegion];
      const grapeRegions = g.regions || [];
      matchesRegion = grapeRegions.some(r => mappedRegions.includes(r) || r === localRegion);
    } 
    // Dropdown selection filter
    else if (activeRegion !== "All") {
      const grapeRegions = g.regions || [];
      matchesRegion = grapeRegions.some(r => r.includes(activeRegion));
    }
    
    const matchesColor = activeColor === "All" || g.color === activeColor;
    return matchesSearch && matchesRegion && matchesColor;
  });

  const displayedGrapes = filteredGrapes.slice(0, visibleCount);

  // Extract unique regions from all grapes for the dropdown
  const allRegions = Array.from(new Set(grapes.flatMap(g => g.regions || []))).sort();

  return (
    <div style={{ position: "relative" }}>
      {/* 1. Filters & Search */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: "24px", 
        marginBottom: "48px",
        padding: "32px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "16px",
        border: `1px solid rgba(255,255,255,0.1)`
      }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Color Filter */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {["All", "Red", "White", "Rosé"].map(color => (
              <button
                key={color}
                onClick={() => { setActiveColor(color); setVisibleCount(10); }}
                style={{
                  padding: "8px 20px",
                  background: activeColor === color ? T.wine : "transparent",
                  color: activeColor === color ? T.paper : "rgba(255,255,255,0.7)",
                  border: `1px solid ${activeColor === color ? T.wine : "rgba(255,255,255,0.2)"}`,
                  borderRadius: "30px",
                  fontFamily: ff.b,
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Region Dropdown Filter */}
          <select 
            value={activeRegion}
            onChange={(e) => { setActiveRegion(e.target.value); setLocalRegion(null); setVisibleCount(10); }}
            style={{
              padding: "10px 20px",
              background: "rgba(0,0,0,0.2)",
              color: "rgba(255,255,255,0.9)",
              border: `1px solid rgba(255,255,255,0.2)`,
              borderRadius: "30px",
              fontFamily: ff.b,
              fontSize: "12px",
              outline: "none",
              cursor: "pointer",
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              minWidth: "160px"
            }}
          >
            <option value="All" style={{ color: T.ink }}>All Regions</option>
            {allRegions.map(r => (
              <option key={r} value={r} style={{ color: T.ink }}>{r}</option>
            ))}
          </select>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
          <input 
            type="text" 
            placeholder="Search varieties (e.g. Malbec)"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(10); }}
            style={{
              width: "100%",
              padding: "12px 20px 12px 44px",
              background: "rgba(0,0,0,0.3)",
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: "8px",
              fontFamily: ff.b,
              fontSize: "14px",
              outline: "none",
              color: T.paper
            }}
          />
          <svg style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
      </div>

      {/* Region Status Bar (Integrated Filter Feedback) */}
      {localRegion && (
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted }}>
            Origin:
          </span>
          <span style={{ 
            padding: "6px 16px", 
            background: T.wine, 
            color: "white", 
            borderRadius: "20px", 
            fontFamily: ff.b, 
            fontSize: "12px", 
            fontWeight: 700 
          }}>
            {localRegion}
          </span>
          <button 
            onClick={() => setLocalRegion(null)} 
            style={{ background: "none", border: "none", color: T.wine, fontSize: "12px", cursor: "pointer", padding: 0 }}
          >
            ✕ Reset Filter
          </button>
        </div>
      )}

      {/* 2. Card Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: "240px", background: T.paper, borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {displayedGrapes.map((grape, i) => (
            <Reveal key={grape.id} delay={(i % 10) * 0.05}>
              <GrapeCard grape={grape} onClick={setSelectedGrape} isDark={true} />
            </Reveal>
          ))}
        </div>
      )}

      {!loading && filteredGrapes.length > visibleCount && (
        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            style={{
              padding: "16px 40px",
              background: "transparent",
              color: T.gold,
              border: `1px solid ${T.gold}`,
              borderRadius: "30px",
              fontFamily: ff.b,
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.gold; }}
          >
            See More Varieties
          </button>
        </div>
      )}

      {!loading && filteredGrapes.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.6)", fontFamily: ff.b }}>
          No varieties found for {localRegion || "your selection"}.
          <br/>
          <button 
            onClick={() => { setLocalRegion(null); setActiveColor("All"); setSearchQuery(""); }}
            style={{ marginTop: "16px", background: "none", border: `1px solid ${T.wine}`, color: T.wine, padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
          >
            Show All Varieties
          </button>
        </div>
      )}

      {/* 3. Side Panel (Drawer) */}
      {selectedGrape && (
        <>
          <div 
            onClick={() => setSelectedGrape(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 9999 }} 
          />
          <GrapeDetailDrawer grape={selectedGrape} onClose={() => setSelectedGrape(null)} />
        </>
      )}
    </div>
  );
}
