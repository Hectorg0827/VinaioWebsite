"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import WineWorldMap from "./WineWorldMap";
import GrapeCard from "./GrapeCard";
import GrapeDetailDrawer from "./GrapeDetailDrawer";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";

/* ── Fallback Seed Data ────────────────────────────────────────────────────
   Used when the Supabase `grapes` table doesn't exist or is unreachable.
   Mirrors the schema so the rest of the component works identically. */
const SEED_GRAPES = [
  { id: "tempranillo", name: "Tempranillo", color: "Red", body: "Medium–Full", acidity: "Medium", profile: { fruit: "Cherry", earth: "Leather", oak: "Vanilla", other: "Tobacco" }, description: "Spain's noble grape, known for longevity and structure.", food_pairings: ["Grilled lamb", "Aged cheeses", "Charcuterie"], tech_sheet: { soil: "Chalky-clay", climate: "Continental" }, is_featured: true, regions: ["Ribera del Duero", "Rioja"] },
  { id: "albarino", name: "Albariño", color: "White", body: "Light–Medium", acidity: "High", profile: { fruit: "Peach", earth: "Saline", oak: "None", other: "Citrus" }, description: "Crisp, aromatic white from the Atlantic coast.", food_pairings: ["Oysters", "Ceviche", "Grilled fish"], tech_sheet: { soil: "Granite", climate: "Maritime" }, is_featured: true, regions: ["Rías Baixas"] },
  { id: "cabernet-sauvignon", name: "Cabernet Sauvignon", color: "Red", body: "Full", acidity: "Medium–High", profile: { fruit: "Blackcurrant", earth: "Graphite", oak: "Cedar", other: "Bell pepper" }, description: "The global king of reds, structured and powerful.", food_pairings: ["Ribeye steak", "Short ribs", "Dark chocolate"], tech_sheet: { soil: "Gravel", climate: "Warm" }, is_featured: true, regions: ["Stellenbosch", "Mendoza", "Napa Valley"] },
  { id: "garnacha", name: "Garnacha", color: "Red", body: "Medium–Full", acidity: "Medium", profile: { fruit: "Raspberry", earth: "Garrigue", oak: "Neutral", other: "White pepper" }, description: "Versatile and plush, the backbone of many Mediterranean blends.", food_pairings: ["Paella", "Roasted vegetables", "Grilled sausage"], tech_sheet: { soil: "Schist", climate: "Hot" }, is_featured: true, regions: ["La Mancha", "Priorat"] },
  { id: "verdejo", name: "Verdejo", color: "White", body: "Light–Medium", acidity: "High", profile: { fruit: "Lime", earth: "Fennel", oak: "None", other: "White flowers" }, description: "Highly aromatic Spanish white with characteristic bitter finish.", food_pairings: ["Tapas", "Goat cheese", "Asparagus"], tech_sheet: { soil: "Gravel", climate: "Dry continental" }, is_featured: true, regions: ["Rueda"] },
  { id: "chenin-blanc", name: "Chenin Blanc", color: "White", body: "Medium", acidity: "High", profile: { fruit: "Quince", earth: "Wet stone", oak: "Honey", other: "Yellow apple" }, description: "Highly versatile grape known for range from bone-dry to sweet.", food_pairings: ["Thai curry", "Roasted pork", "Apple tart"], tech_sheet: { soil: "Shale", climate: "Moderate" }, is_featured: true, regions: ["Western Cape", "Loire Valley"] },
  { id: "sangiovese", name: "Sangiovese", color: "Red", body: "Medium–Full", acidity: "High", profile: { fruit: "Sour cherry", earth: "Dried herbs", oak: "Spice", other: "Tomato leaf" }, description: "The soul of Tuscany, vibrant with acidity and earthy charm.", food_pairings: ["Pasta al ragù", "Pizza", "Hard cheeses"], tech_sheet: { soil: "Clay-limestone", climate: "Mediterranean" }, is_featured: true, regions: ["Tuscany", "Umbria"] },
  { id: "malbec", name: "Malbec", color: "Red", body: "Full", acidity: "Medium", profile: { fruit: "Plum", earth: "Cocoa", oak: "Mocha", other: "Violet" }, description: "Argentina's signature grape, rich and velvety at altitude.", food_pairings: ["Grilled beef", "Empanadas", "Blue cheese"], tech_sheet: { soil: "Alluvial", climate: "High-altitude continental" }, is_featured: true, regions: ["Mendoza", "Cahors"] },
];

/* ── Map country names to the regions in the seed data ─────────────────── */
const COUNTRY_REGION_MAP = {
  "Spain": ["Ribera del Duero", "Rioja", "La Mancha", "Priorat", "Rueda", "Rías Baixas"],
  "Italy": ["Tuscany", "Umbria", "Piedmont", "Veneto"],
  "France": ["Loire Valley", "Bordeaux", "Burgundy", "Cahors"],
  "USA": ["Napa Valley", "Sonoma", "Willamette Valley"],
  "Argentina": ["Mendoza"],
  "Chile": ["Maipo Valley", "Colchagua"],
  "South Africa": ["Stellenbosch", "Western Cape"],
  "Portugal": ["Douro", "Alentejo"],
};

export default function GrapeLibrary() {
  const [grapes, setGrapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeColor, setActiveColor] = useState("All");
  const [selectedGrape, setSelectedGrape] = useState(null);

  useEffect(() => {
    const fetchGrapes = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("grapes")
          .select("*");

        if (!error && data && data.length > 0) {
          setGrapes(data);
        } else {
          // Fallback to seed data when table doesn't exist or is empty
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
    if (selectedRegion) {
      const regionNames = COUNTRY_REGION_MAP[selectedRegion] || [];
      const grapeRegions = g.regions || [];
      matchesRegion = grapeRegions.some(r => regionNames.includes(r));
    }
    
    const matchesColor = activeColor === "All" || g.color === activeColor;
    return matchesSearch && matchesRegion && matchesColor;
  });

  return (
    <div style={{ position: "relative" }}>
      {/* 1. Interactive Regional Map */}
      <div style={{ marginBottom: "80px" }}>
        <WineWorldMap 
          onRegionSelect={(region) => setSelectedRegion(region === selectedRegion ? null : region)} 
          selectedRegion={selectedRegion} 
        />
      </div>

      {/* 2. Filters & Search */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: "24px", 
        marginBottom: "48px",
        padding: "32px",
        background: T.paper,
        borderRadius: "16px",
        border: `1px solid ${T.cream}`
      }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {["All", "Red", "White", "Rosé"].map(color => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              style={{
                padding: "8px 20px",
                background: activeColor === color ? T.wine : "transparent",
                color: activeColor === color ? T.paper : T.muted,
                border: `1px solid ${activeColor === color ? T.wine : T.cream}`,
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

        <div style={{ position: "relative", width: "320px" }}>
          <input 
            type="text" 
            placeholder="Search varieties (e.g. Malbec)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 20px 12px 44px",
              background: T.bg,
              border: `1px solid ${T.cream}`,
              borderRadius: "8px",
              fontFamily: ff.b,
              fontSize: "14px",
              outline: "none",
              color: T.ink
            }}
          />
          <svg style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
      </div>

      {/* Region Status Bar */}
      {selectedRegion && (
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted }}>Filtering by Region:</span>
          <span style={{ padding: "6px 16px", background: T.gold, color: T.paper, borderRadius: "20px", fontFamily: ff.b, fontSize: "12px", fontWeight: 700 }}>{selectedRegion}</span>
          <button onClick={() => setSelectedRegion(null)} style={{ background: "none", border: "none", color: T.wine, fontSize: "12px", cursor: "pointer", padding: 0 }}>✕ Clear</button>
        </div>
      )}

      {/* 3. Card Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: "240px", background: T.paper, borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {filteredGrapes.map((grape, i) => (
            <Reveal key={grape.id} delay={i * 0.05}>
              <GrapeCard grape={grape} onClick={setSelectedGrape} />
            </Reveal>
          ))}
        </div>
      )}

      {!loading && filteredGrapes.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: T.muted, fontFamily: ff.b }}>
          No varieties found matching your filters.
        </div>
      )}

      {/* 4. Side Panel (Drawer) */}
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
