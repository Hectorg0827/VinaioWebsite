"use client";

import { useState } from "react";
import { T, ff } from "@/lib/theme";
import worldPaths from "@/data/world-wine-paths.json";

export default function WineWorldMap({ onRegionSelect, selectedRegion }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getFormat = (id) => {
    const isSelected = selectedRegion === id;
    const isHovered = hovered === id;

    if (isSelected) return { fill: T.wine, opacity: 1, stroke: T.gold, strokeWidth: 2 };
    if (isHovered) return { fill: T.wine, opacity: 0.7, stroke: T.paper, strokeWidth: 1.5 };
    return { fill: "rgba(255,255,255,0.08)", opacity: 1, stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 };
  };

  return (
    <div style={{ position: "relative", width: "100%", background: T.editorialGrey, borderRadius: "20px", padding: "40px", overflow: "hidden", border: `1px solid rgba(255,255,255,0.1)` }}>
      <div 
        style={{ position: "relative", width: "100%", maxWidth: "1000px", margin: "0 auto", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <div style={{ position: "absolute", top: 0, left: 0, padding: "20px", zIndex: 5 }}>
          <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.wine, marginBottom: "8px" }}>Explore Regions</p>
          <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper }}>The Vinaio Global Map</h3>
        </div>

        <svg viewBox="0 0 1000 600" width="100%" height="auto">
          {/* Background Grid Lines for 'Premium' look */}
          {[...Array(10)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[...Array(6)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {worldPaths.map((country) => {
            const format = getFormat(country.id);
            return (
              <path
                key={country.id}
                d={country.d}
                fill={format.fill}
                fillOpacity={format.opacity}
                stroke={format.stroke}
                strokeWidth={format.strokeWidth}
                style={{ 
                  transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                  cursor: "pointer"
                }}
                onMouseEnter={() => setHovered(country.name)}
                onClick={() => onRegionSelect(country.name)}
              />
            );
          })}
        </svg>
      </div>

      {/* Floating Tooltip */}
      {hovered && (
        <div style={{
          position: "fixed",
          top: mousePos.y + 20,
          left: mousePos.x + 20,
          backgroundColor: T.paper,
          color: T.ink,
          padding: "10px 16px",
          borderRadius: "4px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          pointerEvents: "none",
          zIndex: 9999,
          borderLeft: `3px solid ${T.wine}`
        }}>
          <div style={{ fontFamily: ff.h, fontSize: "16px", marginBottom: "2px" }}>{hovered}</div>
          <div style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: T.muted }}>View Local Varieties</div>
        </div>
      )}
    </div>
  );
}
