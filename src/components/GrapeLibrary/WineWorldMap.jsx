"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { T, ff } from "@/lib/theme";
import worldPaths from "@/data/world-svg-paths.json";
import wineKnowledge from "@/data/global-wine-knowledge.json";

export default function WineWorldMap({ onRegionSelect, selectedRegion, theme = "dark" }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const [isTouch, setIsTouch] = useState(false);
  const [hoveredSubRegion, setHoveredSubRegion] = useState(null);
  const svgRef = useRef(null);
  const isLight = theme === "light";

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Map of sub-regions relative to country bounding box (0-1 percentages)
  const SUB_REGIONS = {
    "Spain": [
      { name: "Rioja", rx: 0.55, ry: 0.25, grapes: ["Tempranillo", "Garnacha", "Viura"] },
      { name: "Ribera del Duero", rx: 0.45, ry: 0.35, grapes: ["Tinto Fino (Tempranillo)"] },
      { name: "Priorat", rx: 0.85, ry: 0.3, grapes: ["Garnacha", "Cariñena"] },
      { name: "Rías Baixas", rx: 0.1, ry: 0.15, grapes: ["Albariño"] },
      { name: "Andalucía (Jerez)", rx: 0.4, ry: 0.8, grapes: ["Palomino", "Pedro Ximénez"] }
    ],
    "France": [
      { name: "Bordeaux", rx: 0.3, ry: 0.6, grapes: ["Cabernet Sauvignon", "Merlot"] },
      { name: "Burgundy", rx: 0.65, ry: 0.4, grapes: ["Pinot Noir", "Chardonnay"] },
      { name: "Champagne", rx: 0.6, ry: 0.2, grapes: ["Chardonnay", "Pinot Noir"] },
      { name: "Rhône Valley", rx: 0.7, ry: 0.65, grapes: ["Syrah", "Grenache"] }
    ],
    "Italy": [
      { name: "Tuscany", rx: 0.4, ry: 0.45, grapes: ["Sangiovese", "Vernaccia"] },
      { name: "Piedmont", rx: 0.2, ry: 0.2, grapes: ["Nebbiolo", "Barbera"] },
      { name: "Veneto", rx: 0.5, ry: 0.2, grapes: ["Glera", "Corvina"] },
      { name: "Sicily", rx: 0.6, ry: 0.85, grapes: ["Nero d'Avola", "Etna Rosso"] },
      { name: "Puglia", rx: 0.8, ry: 0.6, grapes: ["Primitivo", "Negroamaro"] }
    ],
    "South Africa": [
      { name: "Stellenbosch", rx: 0.2, ry: 0.8, grapes: ["Cabernet Sauvignon", "Chenin Blanc"] },
      { name: "Swartland", rx: 0.15, ry: 0.7, grapes: ["Syrah", "Chenin Blanc"] }
    ],
    "Argentina": [
      { name: "Mendoza", rx: 0.3, ry: 0.4, grapes: ["Malbec", "Cabernet Franc"] },
      { name: "Patagonia", rx: 0.4, ry: 0.7, grapes: ["Pinot Noir", "Malbec"] }
    ]
  };

  const [countryBBox, setCountryBBox] = useState(null);

  // Vinaio sourcing regions (ISO ALPHA-2 or matching names)
  const sourcingRegions = [
    "Spain", "France", "Italy", "Portugal", "South Africa", 
    "Argentina", "Chile", "Peru", "Colombia", "Uruguay", "Dominican Rep."
  ];

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.001;
    const newZoom = Math.min(Math.max(zoom - e.deltaY * scaleFactor, 0.5), 8);
    setZoom(newZoom);
  };

  const zoomIn = () => setZoom(z => Math.min(z + 0.5, 8));
  const zoomOut = () => setZoom(z => Math.max(z - 0.5, 0.5));
  const resetMap = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setCountryBBox(null);
    onRegionSelect(null);
  };

  const handleCountryClick = (e, country) => {
    if (onRegionSelect) onRegionSelect(country.name);
    
    // Zoom to country BBox
    try {
      const bbox = e.target.getBBox();
      setCountryBBox(bbox);
      
      const padding = 30;
      const scaleX = 900 / (bbox.width + padding * 2);
      const scaleY = 600 / (bbox.height + padding * 2);
      const newZoom = Math.min(scaleX, scaleY, 6); // Max zoom 6 for clarity
      
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      
      const newOffsetX = 450 - cx * newZoom;
      const newOffsetY = 300 - cy * newZoom;
      
      setZoom(newZoom);
      setOffset({ x: newOffsetX, y: newOffsetY });
    } catch (err) {
      console.warn("Could not calculate SVG BBox for zoom");
    }
  };

  const getFormat = (country) => {
    const name = country.name;
    const isSourced = sourcingRegions.includes(name);
    const isSelected = selectedRegion === name;
    const isHovered = hovered?.name === name;

    if (isSelected) {
      return { 
        fill: T.wine, 
        stroke: T.gold, 
        strokeWidth: 2 / zoom, 
        opacity: 1, 
        shadow: "0 0 15px rgba(114, 47, 55, 0.4)" 
      };
    }
    if (isHovered) {
      return { 
        fill: isSourced ? T.wine : (isLight ? T.taupe : "rgba(255,255,255,0.2)"), 
        stroke: isLight ? T.wine : T.paper, 
        strokeWidth: 1.5 / zoom, 
        opacity: 0.8 
      };
    }
    if (isSourced) {
      return { 
        fill: isLight ? "rgba(114, 47, 55, 0.15)" : "rgba(114, 47, 55, 0.3)", 
        stroke: T.gold, 
        strokeWidth: 1 / zoom, 
        opacity: 1 
      };
    }
    return { 
      fill: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)", 
      stroke: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)", 
      strokeWidth: 0.5 / zoom, 
      opacity: 1 
    };
  };

  // Find knowledge data by name or ID
  const activeKnowledge = useMemo(() => {
    if (!hovered) return null;
    // Map of name commonalities
    const lookup = Object.values(wineKnowledge).find(k => 
      k.name.toLowerCase() === hovered.name.toLowerCase() || 
      (hovered.name === "United States of America" && k.name === "USA") ||
      (hovered.name === "Dominican Rep." && k.name === "Dominican Republic")
    );
    return lookup;
  }, [hovered]);

  const viewBox = `${-offset.x / zoom} ${-offset.y / zoom} ${900 / zoom} ${600 / zoom}`;

  return (
    <div className="wine-world-map-container" style={{ 
      position: "relative", width: "100%", 
      background: isLight ? T.paper : T.ink, 
      borderRadius: "24px", 
      padding: "20px", 
      overflow: "hidden", 
      border: `1px solid ${isLight ? T.cream : "rgba(255,255,255,0.08)"}`,
      userSelect: "none"
    }}>
      <style>{`
        .wine-world-map-container {
          min-height: 400px;
        }
        .map-canvas-wrapper {
          width: 100%;
          height: 600px;
        }
        .map-title-box {
          position: absolute; top: 30px; left: 30px; z-index: 10;
        }
        .map-controls {
          position: absolute; bottom: 30px; right: 30px; z-index: 20;
          display: flex; flexDirection: column; gap: 10px;
        }
        .map-legend {
          position: absolute; bottom: 30px; left: 30px; z-index: 20;
          display: flex; gap: 20px; background: ${isLight ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.4)"};
          padding: 10px 18px; borderRadius: 30px; backdropFilter: blur(8px);
          border: 1px solid ${isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)"};
        }

        @media (max-width: 1024px) {
          .map-canvas-wrapper { height: 500px; }
          .map-title-box h3 { font-size: 24px !important; }
        }

        @media (max-width: 768px) {
          .map-canvas-wrapper { height: 400px; }
          .map-title-box { top: 20px; left: 20px; }
          .map-title-box h3 { font-size: 20px !important; }
          .map-title-box p { font-size: 10px !important; max-width: 240px !important; }
          .map-controls { bottom: 20px; right: 20px; }
          .map-legend { 
            bottom: 20px; left: 20px; 
            padding: 8px 12px;
            gap: 12px;
          }
          .map-legend span { font-size: 9px !important; }
        }

        @media (max-width: 480px) {
          .map-canvas-wrapper { height: 350px; }
          .map-title-box { width: calc(100% - 40px); }
          .map-legend { display: none; }
        }

        /* Landscape specific fix */
        @media (max-height: 500px) and (orientation: landscape) {
          .map-canvas-wrapper { height: calc(100vh - 100px); }
          .map-title-box { top: 15px; left: 15px; }
          .map-controls { bottom: 15px; right: 15px; }
          .map-legend { display: none; }
        }
      `}</style>
      {/* Title & Stats */}
      <div className="map-title-box">
        <p style={{ 
          fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", 
          color: isLight ? T.wine : T.gold, marginBottom: "6px" 
        }}>
          Global Terroir Explorer
        </p>
        <h3 style={{ 
          fontFamily: ff.h, fontSize: "28px", color: isLight ? T.ink : T.paper,
          margin: 0, fontWeight: 400
        }}>
          World of Wine
        </h3>
        <p style={{ 
          fontFamily: ff.b, fontSize: "11px", color: T.muted, marginTop: "8px",
          maxWidth: "300px", lineHeight: "1.5"
        }}>
          Discover regional profiles, indigenous grapes, and Vinaio sourced estates across {worldPaths.length} countries.
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="map-controls">
        <button onClick={zoomIn} style={controlStyle(isLight)} title="Zoom In">+</button>
        <button onClick={zoomOut} style={controlStyle(isLight)} title="Zoom Out">−</button>
        <button onClick={resetMap} style={{ ...controlStyle(isLight), fontSize: "9px" }}>RESET</button>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: T.wine, border: `1px solid ${T.gold}` }} />
          <span style={{ fontFamily: ff.b, fontSize: "10px", color: isLight ? T.ink : T.paper }}>Vinaio Sourced</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.15)" }} />
          <span style={{ fontFamily: ff.b, fontSize: "10px", color: isLight ? T.muted : T.charcoal }}>Terroir Discovery</span>
        </div>
      </div>

      {/* Map Canvas */}
      <div 
        className="map-canvas-wrapper"
        style={{ 
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none"
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsDragging(false); setHovered(null); }}
        onWheel={handleWheel}
      >
        <svg 
          ref={svgRef}
          viewBox={viewBox} 
          width="100%" height="100%" 
          preserveAspectRatio="xMidYMid meet"
          style={{ transition: isDragging ? "none" : "viewBox 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)" }}
        >
          <defs>
            <filter id="elevate" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
              <feOffset dx="0.5" dy="0.5" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint Oceans */}
          <rect x="-2000" y="-2000" width="4000" height="4000" fill={isLight ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.02)"} />
          
          {/* Subtle Grid */}
          {[...Array(30)].map((_, i) => (
             <line key={`v-${i}`} x1={i * 100 - 1500} y1="-1500" x2={i * 100 - 1500} y2="2500" stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"} strokeWidth="0.5" />
          ))}
          {[...Array(30)].map((_, i) => (
             <line key={`h-${i}`} x1="-1500" y1={i * 100 - 1500} x2="2500" y2={i * 100 - 1500} stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"} strokeWidth="0.5" />
          ))}

          {worldPaths.map((country) => {
            const format = getFormat(country);
            return (
              <path
                key={country.id}
                d={country.d}
                fill={format.fill}
                stroke={format.stroke}
                strokeWidth={format.strokeWidth}
                filter={sourcingRegions.includes(country.name) ? "url(#elevate)" : "none"}
                style={{ 
                  transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                  cursor: "pointer"
                }}
                onMouseEnter={() => setHovered(country)}
                onClick={(e) => handleCountryClick(e, country)}
              />
            );
          })}

          {/* Render Sub-Regions if a country is selected and zoomed */}
          {selectedRegion && countryBBox && SUB_REGIONS[selectedRegion] && (
            <g>
              {SUB_REGIONS[selectedRegion].map((sub, i) => {
                const cx = countryBBox.x + countryBBox.width * sub.rx;
                const cy = countryBBox.y + countryBBox.height * sub.ry;
                const isHovered = hoveredSubRegion?.name === sub.name;
                
                return (
                  <g key={i} 
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredSubRegion(sub);
                    }}
                    onMouseLeave={() => setHoveredSubRegion(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle 
                      cx={cx} cy={cy} r={3 / zoom} 
                      fill={isLight ? T.paper : T.ink} 
                      stroke={T.gold} 
                      strokeWidth={1.5 / zoom}
                      style={{ transition: "all 0.3s", transformOrigin: `${cx}px ${cy}px`, transform: isHovered ? "scale(1.5)" : "scale(1)" }}
                    />
                    <text 
                      x={cx} y={cy - (6 / zoom)} 
                      textAnchor="middle" 
                      fill={isLight ? T.ink : T.paper}
                      fontSize={10 / zoom}
                      fontFamily={ff.b}
                      fontWeight="bold"
                      style={{
                        opacity: isHovered ? 1 : 0.7,
                        textShadow: isLight ? "0 1px 3px rgba(255,255,255,0.8)" : "0 1px 3px rgba(0,0,0,0.8)",
                        transition: "all 0.3s"
                      }}
                    >
                      {sub.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Floating Knowledge Card */}
      {hovered && !isTouch && (
        <div style={{
          position: "fixed",
          top: mousePos.y + 20,
          left: mousePos.x + 20,
          width: "260px",
          backgroundColor: isLight ? "rgba(255,255,255,0.9)" : "rgba(26, 24, 21, 0.9)",
          color: isLight ? T.ink : T.paper,
          padding: "20px",
          borderRadius: "12px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          pointerEvents: "none",
          zIndex: 9999,
          border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
          borderLeft: `4px solid ${T.wine}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <h4 style={{ fontFamily: ff.h, fontSize: "20px", margin: 0 }}>{hovered.name}</h4>
            {sourcingRegions.includes(hovered.name) && (
              <span style={{ 
                fontSize: "8px", background: T.wine, color: "white", padding: "2px 6px", 
                borderRadius: "10px", letterSpacing: "1px", textTransform: "uppercase" 
              }}>Vinaio Sourced</span>
            )}
          </div>

          {hoveredSubRegion ? (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <p style={labelStyle}>Region Profile</p>
                <p style={valueStyle}>{hoveredSubRegion.name}</p>
              </div>
              <div>
                <p style={labelStyle}>Signature Grapes</p>
                <p style={{ ...valueStyle, fontStyle: "italic", lineHeight: "1.4" }}>{hoveredSubRegion.grapes.join(", ")}</p>
              </div>
            </div>
          ) : activeKnowledge ? (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <p style={labelStyle}>Notable Grapes</p>
                <p style={valueStyle}>{activeKnowledge.grapes.join(", ")}</p>
              </div>
              <div>
                <p style={labelStyle}>Terroir Profile</p>
                <p style={{ ...valueStyle, fontStyle: "italic", lineHeight: "1.4" }}>"{activeKnowledge.terroir_vibe}"</p>
              </div>
              <p style={{ fontSize: "10px", color: T.gold, marginTop: "12px", letterSpacing: "1px" }}>CLICK TO EXPLORE REGIONS & ESTATES</p>
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: T.muted }}>No specific wine data available for this region yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

const controlStyle = (isLight) => ({
  background: isLight ? T.paper : T.ink,
  border: `1px solid ${isLight ? T.taupe : "rgba(255,255,255,0.2)"}`,
  color: isLight ? T.ink : T.paper,
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  fontFamily: ff.b,
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontWeight: 400,
  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
  outline: "none"
});

const labelStyle = {
  fontFamily: ff.b,
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: T.gold,
  marginBottom: "4px"
};

const valueStyle = {
  fontFamily: ff.b,
  fontSize: "13px",
  margin: 0,
  color: "inherit",
  opacity: 0.9
};
