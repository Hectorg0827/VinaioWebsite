"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import WineWorldMap from "./WineWorldMap";
import GrapeCard from "./GrapeCard";
import GrapeDetailDrawer from "./GrapeDetailDrawer";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";

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
      const supabase = createClient();
      
      let query = supabase.from("grapes").select(`
        *,
        wine_regions (*)
      `);

      const { data, error } = await query;
      if (!error && data) {
        setGrapes(data);
      }
      setLoading(false);
    };

    fetchGrapes();
  }, []);

  const filteredGrapes = grapes.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || (g.wine_regions && g.wine_regions.some(r => r.name === selectedRegion));
    const matchesColor = activeColor === "All" || g.color === activeColor;
    return matchesSearch && matchesRegion && matchesColor;
  });

  return (
    <div style={{ position: "relative" }}>
      {/* 1. Interactive Regional Map */}
      <div style={{ marginBottom: "80px" }}>
        <WineWorldMap 
          onRegionSelect={(region) => setSelectedRegion(region === selectedRegion ? null : region)} 
          selectedRegion={worldToId(selectedRegion)} 
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
          <button onClick={() => setSelectedRegion(null)} style={{ background: "none", border: "none", color: T.wine, fontSize: "12px", cursor: "pointer", padding: 0 }}>✕ Clear Region</button>
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

function worldToId(name) {
  if (!name) return null;
  const MAP = { "Spain": "ES", "Italy": "IT", "France": "FR", "USA": "US", "Argentina": "AR", "Chile": "CL", "South Africa": "ZA", "Portugal": "PT" };
  return MAP[name] || null;
}
