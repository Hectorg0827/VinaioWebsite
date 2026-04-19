"use client";

import { useState } from "react";
import usPaths from "../data/us-paths.json";
import { T, ff } from "@/lib/theme";

const MARKET_STATUS = {
  // Direct Distribution
  NY: "Direct Distribution",
  NJ: "Direct Distribution",
  FL: "Direct Distribution",
  
  // Partner Network
  UT: "Partner Network",
  OH: "Partner Network",
  NC: "Partner Network",
  SC: "Partner Network",
  GA: "Partner Network",
  CA: "Partner Network",
  TX: "Partner Network",
  IL: "Partner Network",
  PA: "Partner Network",
  MA: "Partner Network",
};

export default function DistributionMap() {
  const [hoveredState, setHoveredState] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Offset the tooltip to stick near cursor
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getFormat = (id) => {
    const status = MARKET_STATUS[id];
    if (status === "Direct Distribution") return { fill: T.wine, opacity: 1, stroke: T.paper, strokeWidth: 1 };
    if (status === "Partner Network") return { fill: T.gold, opacity: 0.8, stroke: T.paper, strokeWidth: 1 };
    return { fill: "rgba(0,0,0,0.06)", opacity: 1, stroke: "rgba(255,255,255,0.4)", strokeWidth: 1 };
  };

  return (
    <div style={{ position: "relative", width: "100%", padding: "20px" }}>
      
      {/* Map Container */}
      <div 
        style={{ position: "relative", width: "100%", maxWidth: "900px", margin: "0 auto", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredState(null)}
      >
        <svg viewBox="0 0 959 593" width="100%" height="auto" style={{ filter: `drop-shadow(0px 10px 20px rgba(0,0,0,0.05))` }}>
          {usPaths.map((stateData) => {
            const format = getFormat(stateData.id);
            const isHovered = hoveredState === stateData.id;
            
            return (
              <path
                key={stateData.id}
                d={stateData.d}
                fill={format.fill}
                fillOpacity={format.opacity}
                stroke={format.stroke}
                strokeWidth={format.strokeWidth}
                style={{ 
                  transition: "all 0.3s ease",
                  transformOrigin: "center",
                  cursor: MARKET_STATUS[stateData.id] ? "pointer" : "default",
                  filter: isHovered && MARKET_STATUS[stateData.id] ? "brightness(1.15)" : "none"
                }}
                onMouseEnter={() => setHoveredState(stateData.id)}
              />
            );
          })}
        </svg>
      </div>

      {/* Floating Tooltip */}
      {hoveredState && MARKET_STATUS[hoveredState] && (
        <div style={{
          position: "fixed",
          top: mousePos.y + 15,
          left: mousePos.x + 15,
          backgroundColor: T.ink,
          color: T.paper,
          padding: "12px 16px",
          borderRadius: "6px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          pointerEvents: "none",
          zIndex: 9999,
          minWidth: "150px"
        }}>
          <div style={{ fontFamily: ff.h, fontSize: "16px", marginBottom: "4px", color: T.paper }}>
            {usPaths.find(p => p.id === hoveredState)?.name}
          </div>
          <div style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: MARKET_STATUS[hoveredState] === "Direct Distribution" ? T.wineLight || "#f2d8d8" : T.gold }}>
            {MARKET_STATUS[hoveredState]}
          </div>
        </div>
      )}
    </div>
  );
}
