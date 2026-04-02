"use client";

export default function Reveal({ children }) {
  return (
    <div style={{ position: "relative", zIndex: 1, pointerEvents: "auto" }}>
      {children}
    </div>
  );
}
