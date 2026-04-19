"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Hr from "@/components/Hr";

export default function GrapeDetailDrawer({ grape, onClose }) {
  const [showTech, setShowTech] = useState(false);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!grape) return;
    
    const fetchMatches = async () => {
      setLoading(true);
      const supabase = createClient();
      
      // Match products where grape name is in grape_ids array or tags
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`grape_ids.cs.{${grape.id}},tags.cs.{${grape.name.toLowerCase()}}`)
        .limit(4);

      if (!error && data) {
        setMatchingProducts(data);
      }
      setLoading(false);
    };

    fetchMatches();
  }, [grape]);

  if (!grape) return null;

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "500px",
      background: T.paper, boxShadow: "-20px 0 50px rgba(0,0,0,0.15)", zIndex: 10000,
      display: "flex", flexDirection: "column", animation: "slideIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)"
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
      
      {/* Header */}
      <div style={{ padding: "40px", borderBottom: `1px solid ${T.cream}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.wine, marginBottom: "12px" }}>Variety Spotlight</p>
          <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, lineHeight: 1 }}>{grape.name}</h2>
          <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, marginTop: "8px" }}>{grape.color} · {grape.body} Body</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: T.ink }}>✕</button>
      </div>

      {/* Content */}
      <div style={{ flexGrow: 1, overflowY: "auto", padding: "40px" }}>
        <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.ink, lineHeight: 1.8, marginBottom: "32px" }}>{grape.description}</p>

        {/* Sensory Profile */}
        <div style={{ marginBottom: "40px" }}>
          <h4 style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>Sensory Profile</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {Object.entries(grape.profile || {}).map(([key, val]) => (
              <div key={key}>
                <p style={{ fontFamily: ff.b, fontSize: "9px", textTransform: "uppercase", color: T.muted, marginBottom: "4px" }}>{key}</p>
                <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.ink, fontWeight: 600 }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pairings */}
        <div style={{ marginBottom: "40px", background: T.bg, padding: "24px", borderRadius: "12px" }}>
          <h4 style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.wine, marginBottom: "16px" }}>Classic Pairings</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {grape.food_pairings?.map(p => (
              <span key={p} style={{ padding: "6px 14px", background: T.paper, borderRadius: "20px", fontSize: "12px", fontFamily: ff.b }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Vinaio Portfolio Integration */}
        <div style={{ marginBottom: "40px" }}>
          <h4 style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>The Vinaio Selection</h4>
          {loading ? (
            <div style={{ height: "100px", background: `${T.wine}05`, borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
          ) : matchingProducts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {matchingProducts.map(p => (
                <Link key={p.id} href={`/portfolio/${p.id}`} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px", background: "white", border: `1px solid ${T.cream}`, borderRadius: "8px", textDecoration: "none", transition: "border-color 0.3s" }}>
                  <img src={p.imageUrl || p.image_url} style={{ width: "40px", height: "60px", objectFit: "contain" }} alt={p.name} />
                  <div>
                    <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.ink, fontWeight: 700, margin: 0 }}>{p.brand}</p>
                    <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted, margin: 0 }}>{p.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted }}>Currently sourcing New Selections for this variety.</p>
          )}
        </div>

        {/* Tech Sheet Toggle */}
        <div style={{ borderTop: `1px solid ${T.cream}`, paddingTop: "24px" }}>
          <button 
            onClick={() => setShowTech(!showTech)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <span style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.ink, fontWeight: 700 }}>Expert Tech Sheet</span>
            <span>{showTech ? '−' : '+'}</span>
          </button>
          
          {showTech && (
            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {Object.entries(grape.tech_sheet || {}).map(([key, val]) => (
                <div key={key}>
                  <p style={{ fontFamily: ff.b, fontSize: "9px", textTransform: "uppercase", color: T.muted }}>{key.replace('_', ' ')}</p>
                  <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.ink }}>{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer CTA */}
      <div style={{ padding: "40px", background: T.bg }}>
        <Link href="/portfolio" style={{ display: "block", textAlign: "center", padding: "16px", background: T.wine, color: T.paper, textDecoration: "none", fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, borderRadius: "4px" }}>View Full Portfolio</Link>
      </div>
    </div>
  );
}
