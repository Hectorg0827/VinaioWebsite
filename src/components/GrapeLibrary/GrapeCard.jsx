"use client";

import { T, ff } from "@/lib/theme";
import { useState } from "react";

const FlavorIcon = ({ type, color = T.wine }) => {
  // Simple SVG icons for flavors
  if (type === "fruit") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v3"/></svg>;
  if (type === "oak") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 3h18v18H3z"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>;
  if (type === "earth") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
  return null;
};

export default function GrapeCard({ grape, onClick, isDark = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const raw = grape.profile;
  const profile = typeof raw === 'string' ? JSON.parse(raw) : (raw || {});

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(grape)}
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : T.paper,
        borderRadius: "16px",
        padding: "28px",
        border: `1px solid ${isHovered ? T.wine : (isDark ? "rgba(255,255,255,0.1)" : T.cream)}`,
        transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
        cursor: "pointer",
        transform: isHovered ? "translateY(-6px)" : "none",
        boxShadow: isHovered ? `0 20px 40px rgba(0,0,0,${isDark ? '0.3' : '0.08'})` : "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Stripe indicating color */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "4px", background: grape.color === 'Red' ? T.wine : (grape.color === 'White' ? T.gold : '#ffb6c1') }} />

      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontFamily: ff.h, fontSize: "22px", color: isDark ? T.paper : T.ink, marginBottom: "4px" }}>{grape.name}</h4>
        <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: isDark ? T.gold : T.muted }}>{grape.body} · {grape.color}</p>
      </div>

      <div style={{ flexGrow: 1 }}>
        <p style={{ fontFamily: ff.b, fontSize: "13px", color: isDark ? "rgba(255,255,255,0.7)" : T.muted, lineHeight: 1.6, marginBottom: "16px", fontStyle: "italic" }}>
          {grape.description ? grape.description.substring(0, 80) + '…' : ''}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          {profile.fruit && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FlavorIcon type="fruit" color={isDark ? T.gold : T.wine} />
              <span style={{ fontSize: "11px", color: isDark ? T.paper : T.ink, fontFamily: ff.b }}>{profile.fruit}</span>
            </div>
          )}
          {profile.oak && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FlavorIcon type="oak" color={isDark ? T.gold : T.wine} />
              <span style={{ fontSize: "11px", color: isDark ? T.paper : T.ink, fontFamily: ff.b }}>{profile.oak}</span>
            </div>
          )}
          {profile.earth && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FlavorIcon type="earth" color={isDark ? T.gold : T.wine} />
              <span style={{ fontSize: "11px", color: isDark ? T.paper : T.ink, fontFamily: ff.b }}>{profile.earth}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : T.cream}`, paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: ff.b, fontSize: "10px", color: isDark ? T.gold : T.wine, fontWeight: 600 }}>Explore Variety</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? T.gold : T.wine} strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  );
}
