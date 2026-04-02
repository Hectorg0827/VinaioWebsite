"use client";

import { T, ff } from "@/lib/theme";

const NAV_ITEMS = [
  { id: "products", label: "Product Catalog", icon: "🍷" },
  { id: "media", label: "Media & Branding", icon: "🖼️" },
  { id: "catalogs", label: "Customer Catalogs", icon: "📁" },
  { id: "analytics", label: "Portal Analytics", icon: "📊" },
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <div 
      style={{ 
        width: "280px", 
        height: "calc(100vh - 80px)", 
        background: T.ink, 
        position: "fixed", 
        left: 0, 
        top: "80px", 
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${T.wine}40`,
        zIndex: 40
      }}
    >
      <div style={{ padding: "0 32px 40px" }}>
        <p style={{ 
          fontFamily: ff.b, 
          fontSize: "9px", 
          letterSpacing: "3px", 
          textTransform: "uppercase", 
          color: T.warm,
          marginBottom: "20px"
        }}>
          Management
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 20px",
                  background: isActive ? T.wine : "transparent",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  textAlign: "left",
                  width: "100%"
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span style={{ 
                  fontFamily: ff.b, 
                  fontSize: "13px", 
                  color: isActive ? T.paper : T.warm,
                  letterSpacing: "0.5px",
                  fontWeight: isActive ? 600 : 400
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "auto", padding: "0 32px" }}>
        <a 
          href="/" 
          target="_blank"
          style={{ 
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            background: `${T.wine}20`,
            borderRadius: "12px",
            textDecoration: "none",
            border: `1px solid ${T.wine}40`
          }}
        >
          <span style={{ fontSize: "14px" }}>🏠</span>
          <span style={{ fontFamily: ff.b, fontSize: "11px", color: T.paper, letterSpacing: "1px", textTransform: "uppercase" }}>
            View Public Site
          </span>
        </a>
      </div>
    </div>
  );
}
