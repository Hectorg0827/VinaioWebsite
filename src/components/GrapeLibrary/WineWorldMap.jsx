"use client";
import { useState } from "react";
import { T, ff } from "@/lib/theme";
import winePaths from "@/data/world-wine-paths.json";

export default function WineWorldMap({ onRegionSelect, selectedRegion, theme = "dark" }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isLight = theme === "light";

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getFormat = (countryName) => {
    const isSelected = selectedRegion === countryName;
    const isHovered = hovered === countryName;

    if (isSelected) {
      return { 
        fill: T.wine, 
        opacity: 1, 
        stroke: T.gold, 
        strokeWidth: 2.5 
      };
    }
    if (isHovered) {
      return { 
        fill: T.wine, 
        opacity: 0.65, 
        stroke: isLight ? T.wine : T.paper, 
        strokeWidth: 1.5 
      };
    }
    return { 
      fill: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.08)", 
      opacity: 1, 
      stroke: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)", 
      strokeWidth: 1 
    };
  };

  return (
    <div style={{ 
      position: "relative", width: "100%", 
      background: isLight ? T.paper : T.ink, 
      borderRadius: "20px", 
      padding: "30px", 
      overflow: "hidden", 
      border: `1px solid ${isLight ? T.cream : "rgba(255,255,255,0.08)"}` 
    }}>
      <div 
        style={{ position: "relative", width: "100%", maxWidth: "1000px", margin: "0 auto", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Title overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, padding: "10px", zIndex: 5 }}>
          <p style={{ 
            fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", 
            color: isLight ? T.wine : T.gold, marginBottom: "4px" 
          }}>
            Vinaio Global Sourcing
          </p>
          <h3 style={{ fontFamily: ff.h, fontSize: "20px", color: isLight ? T.ink : T.paper }}>Terroir Explorer</h3>
        </div>

        <svg viewBox="0 0 700 520" width="100%" height="auto" style={{ minHeight: "300px" }}>
          {/* Subtle grid for premium feel */}
          {[...Array(8)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="520" stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"} strokeWidth="1" />
          ))}
          {[...Array(6)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 100} x2="700" y2={i * 100} stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"} strokeWidth="1" />
          ))}

          {winePaths.map((country) => {
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
          {winePaths.map((country) => {
            const nums = country.d.match(/[-?\d.]+/g).map(Number);
            const xs = nums.filter((_, i) => i % 2 === 0);
            const ys = nums.filter((_, i) => i % 2 === 1);
            const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
            const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
            
            const isActive = hovered === country.name || selectedRegion === country.name;
            
            return (
              <text 
                key={`label-${country.id}`} 
                x={cx} y={cy + 3} 
                textAnchor="middle" 
                style={{ 
                  fontFamily: ff.b, 
                  fontSize: "7px", 
                  letterSpacing: "1px",
                  fill: isActive ? (isLight ? T.paper : T.paper) : (isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"), 
                  textTransform: "uppercase",
                  pointerEvents: "none",
                  transition: "fill 0.3s",
                  fontWeight: isActive ? 600 : 400
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
          backgroundColor: isLight ? T.ink : T.paper,
          color: isLight ? T.paper : T.ink,
          padding: "10px 16px",
          borderRadius: "4px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          pointerEvents: "none",
          zIndex: 9999,
          borderLeft: `3px solid ${T.wine}`
        }}>
          <div style={{ fontFamily: ff.h, fontSize: "16px", marginBottom: "2px" }}>{hovered}</div>
          <div style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: isLight ? "rgba(255,255,255,0.5)" : T.muted }}>
            Click to explore Terroir
          </div>
        </div>
      )}
    </div>
  );
}
