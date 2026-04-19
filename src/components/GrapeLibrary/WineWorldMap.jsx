"use client";

import { useState } from "react";
import { T, ff } from "@/lib/theme";

/* ── Simplified world wine country shapes (SVG paths) ──────────────────── */
const WINE_COUNTRIES = [
  { id: "US", name: "USA", d: "M80,140 L100,120 L160,115 L200,120 L240,130 L260,145 L255,180 L230,195 L190,200 L140,195 L100,185 L75,170 Z" },
  { id: "ES", name: "Spain", d: "M445,185 L485,180 L500,190 L495,215 L475,225 L445,220 L435,205 Z" },
  { id: "FR", name: "France", d: "M455,145 L490,140 L505,155 L500,180 L480,185 L455,180 L445,165 Z" },
  { id: "IT", name: "Italy", d: "M505,170 L520,160 L530,175 L525,200 L515,225 L505,240 L500,225 L510,200 L505,185 Z" },
  { id: "PT", name: "Portugal", d: "M425,190 L440,188 L442,218 L435,225 L425,215 Z" },
  { id: "ZA", name: "South Africa", d: "M530,420 L565,410 L590,420 L595,445 L575,460 L545,455 L530,440 Z" },
  { id: "AR", name: "Argentina", d: "M270,380 L290,370 L305,400 L300,450 L285,490 L265,480 L260,440 L265,410 Z" },
  { id: "CL", name: "Chile", d: "M250,370 L265,375 L260,410 L255,450 L250,480 L240,470 L245,420 Z" },
];

export default function WineWorldMap({ onRegionSelect, selectedRegion }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getFormat = (countryName) => {
    const isSelected = selectedRegion === countryName;
    const isHovered = hovered === countryName;

    if (isSelected) return { fill: T.wine, opacity: 1, stroke: T.gold, strokeWidth: 2.5 };
    if (isHovered) return { fill: T.wine, opacity: 0.65, stroke: T.paper, strokeWidth: 1.5 };
    return { fill: "rgba(255,255,255,0.1)", opacity: 1, stroke: "rgba(255,255,255,0.25)", strokeWidth: 1 };
  };

  return (
    <div style={{ 
      position: "relative", width: "100%", 
      background: T.ink, 
      borderRadius: "20px", padding: "40px", overflow: "hidden", 
      border: `1px solid rgba(255,255,255,0.08)` 
    }}>
      <div 
        style={{ position: "relative", width: "100%", maxWidth: "1000px", margin: "0 auto", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Title overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, padding: "20px", zIndex: 5 }}>
          <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.wine, marginBottom: "8px" }}>Explore Regions</p>
          <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper }}>The Vinaio Global Map</h3>
        </div>

        <svg viewBox="0 0 700 520" width="100%" height="auto" style={{ minHeight: "300px" }}>
          {/* Subtle grid for premium feel */}
          {[...Array(8)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="520" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[...Array(6)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 100} x2="700" y2={i * 100} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {WINE_COUNTRIES.map((country) => {
            const format = getFormat(country.name);
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

          {/* Country labels */}
          {WINE_COUNTRIES.map((country) => {
            // Compute rough center of path bounding box for label position
            const nums = country.d.match(/[\d.]+/g).map(Number);
            const xs = nums.filter((_, i) => i % 2 === 0);
            const ys = nums.filter((_, i) => i % 2 === 1);
            const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
            const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
            return (
              <text 
                key={`label-${country.id}`} 
                x={cx} y={cy + 3} 
                textAnchor="middle" 
                style={{ 
                  fontFamily: ff.b, 
                  fontSize: "8px", 
                  letterSpacing: "1.5px",
                  fill: hovered === country.name || selectedRegion === country.name ? T.paper : "rgba(255,255,255,0.4)", 
                  textTransform: "uppercase",
                  pointerEvents: "none",
                  transition: "fill 0.3s"
                }}
              >
                {country.name}
              </text>
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
          <div style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: T.muted }}>Click to Filter Varieties</div>
        </div>
      )}
    </div>
  );
}
