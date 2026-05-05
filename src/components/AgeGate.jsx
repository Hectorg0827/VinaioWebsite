"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";

export default function AgeGate() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [splitDoors, setSplitDoors] = useState(false);

  useEffect(() => {
    // Check if the user has already verified their age
    const isVerified = localStorage.getItem("vinaio_age_verified");
    if (!isVerified) {
      // Small delay to ensure smooth mount
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem("vinaio_age_verified", "true");
    setAnimatingOut(true);
    
    // 1. Fade out the modal content
    setTimeout(() => {
      setSplitDoors(true); // 2. Trigger the split doors animation
      
      // 3. Remove from DOM entirely after doors slide away
      setTimeout(() => {
        setShow(false);
      }, 800);
    }, 300);
  };

  const handleNo = () => {
    setError(true);
  };

  if (!show) return null;

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: animatingOut ? "none" : "auto",
        overflow: "hidden"
      }}
    >
      {/* Top Door */}
      <div 
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "50vh",
          background: "rgba(26,24,21,0.98)", // T.ink very dark
          backdropFilter: "blur(12px)",
          transform: splitDoors ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)",
          zIndex: 1
        }}
      />
      
      {/* Bottom Door */}
      <div 
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "50vh",
          background: "rgba(26,24,21,0.98)", // T.ink very dark
          backdropFilter: "blur(12px)",
          transform: splitDoors ? "translateY(100%)" : "translateY(0)",
          transition: "transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)",
          zIndex: 1
        }}
      />

      {/* Modal Content */}
      <div 
        style={{
          background: T.paper,
          border: `1px solid ${T.cream}`,
          borderRadius: "16px",
          padding: "56px 48px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          opacity: animatingOut ? 0 : 1,
          transform: animatingOut ? "scale(0.95)" : "scale(1)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          zIndex: 2,
          margin: "0 24px" // mobile padding
        }}
      >
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "center" }}>
          {/* Vinaio Imports Logo */}
          <img 
            src="/images/logos/vinaio-imports.svg" 
            alt="Vinaio Imports Logo" 
            style={{ width: "220px", height: "auto" }}
          />
        </div>

        <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "16px" }}>
          Are you 21 or older?
        </h2>
        
        <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, lineHeight: 1.6, marginBottom: "40px" }}>
          You must be of legal drinking age to enter this site. By entering, you agree to our Terms of Service and Privacy Policy.
        </p>

        {error ? (
          <div style={{ padding: "20px", background: "#FDECEC", border: "1px solid #F5C6C6", borderRadius: "8px", marginBottom: "24px" }}>
            <p style={{ fontFamily: ff.b, fontSize: "14px", color: "#C0392B" }}>
              You must be of legal drinking age to view this content.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexDirection: "column", sm: { flexDirection: "row" } }}>
            <button
              onClick={handleYes}
              style={{
                fontFamily: ff.b,
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                background: T.wine,
                color: "white",
                border: "none",
                padding: "16px 32px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "background 0.3s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#5a1b24"}
              onMouseLeave={(e) => e.currentTarget.style.background = T.wine}
            >
              Yes, I am 21 or older
            </button>
            
            <button
              onClick={handleNo}
              style={{
                fontFamily: ff.b,
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                background: "transparent",
                color: T.muted,
                border: `1px solid ${T.taupe}`,
                padding: "16px 32px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = T.ink; e.currentTarget.style.borderColor = T.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.taupe; }}
            >
              No, I am under 21
            </button>
          </div>
        )}
        
        <p style={{ fontFamily: ff.b, fontSize: "10px", color: T.taupe, marginTop: "32px", letterSpacing: "1px", textTransform: "uppercase" }}>
          Please enjoy responsibly.
        </p>
      </div>
    </div>
  );
}
