"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "@/lib/theme";

export default function ScrollLine({ 
  height = "160px", 
  color = T.wine,
  bgColor = "rgba(0,0,0,0.05)",
  nodeColor = T.wine,
  nodeBg = T.paper,
  hasNode = true
}) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Start drawing when the top of the line hits 80% of the viewport height.
      // Finish drawing when the top of the line hits 35% of the viewport height.
      const start = viewHeight * 0.8;
      const end = viewHeight * 0.35;
      
      const elementTop = rect.top;
      
      let p = (start - elementTop) / (start - end);
      p = Math.max(0, Math.min(1, p)); // Clamp between 0 and 1
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 auto", padding: "16px 0" }}>
      {/* The Line Container */}
      <div 
        ref={containerRef}
        style={{ 
          width: "1px", 
          height, 
          background: bgColor, 
          position: "relative", 
          overflow: "hidden" 
        }}
      >
        {/* The Animated Fill Line */}
        <div 
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            background: color, 
            transformOrigin: "top",
            transform: `scaleY(${progress})`,
            transition: "transform 0.1s linear" // Smoothly interpolate scroll steps
          }} 
        />
      </div>

      {/* The Connecting Node */}
      {hasNode && (
        <div style={{
          marginTop: "-1px", // Flush to the line
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: nodeBg,
          border: `1px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Nice bounce
          boxShadow: progress >= 0.98 ? `0 0 16px ${color}60` : 'none',
          transform: progress >= 0.98 ? 'scale(1.3)' : 'scale(0.8)'
        }}>
          {/* Inner fill when complete */}
          <div style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: color,
            opacity: progress >= 0.98 ? 1 : 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transform: progress >= 0.98 ? 'scale(1)' : 'scale(0)'
          }} />
        </div>
      )}
    </div>
  );
}
