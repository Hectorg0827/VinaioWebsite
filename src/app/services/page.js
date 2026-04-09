"use client";

import { useState } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Reveal from "@/components/Reveal";
import Hr from "@/components/Hr";

const SUPPLIER_SERVICES = [
  {
    icon: "🌐",
    title: "Import & Compliance",
    items: [
      "Federal and state import licensing",
      "TTB label approval & COLA registration",
      "FDA compliance and documentation",
      "CBMA tax credit management",
      "Federal & state excise tax navigation"
    ]
  },
  {
    icon: "📦",
    title: "Logistics & Supply Chain",
    items: [
      "International freight coordination",
      "Bonded & temperature-controlled warehouses",
      "Inventory management & forecasting",
      "Last-mile delivery to accounts",
      "DOM & Logistics coordination"
    ]
  },
  {
    icon: "📈",
    title: "Sales & Distribution",
    items: [
      "Direct sales force in NY, NJ, and FL",
      "National distribution through 26+ partners",
      "Key account management (on/off premise)",
      "Trade show representation",
      "Channel strategy & launch planning"
    ]
  },
  {
    icon: "🇪🇸",
    title: "European Operations",
    items: [
      "Sourcing via Vinaio Spain SL",
      "Export documentation from Europe",
      "Quality control at origin",
      "Distribution in Spain & key EU markets",
      "Bilingual team & cultural fluency"
    ]
  }
];

const BUYER_SERVICES = [
  {
    icon: "🍷",
    title: "Curated Portfolio",
    items: [
      "Access to 580+ premium SKUs",
      "Authentic wines & craft spirits",
      "Caribbean & Latin specialty portfolio",
      "Expertly vetted labels for market fit",
      "Small-batch & boutique selections"
    ]
  },
  {
    icon: "👤",
    title: "Dedicated Reps",
    items: [
      "Personalized market consultations",
      "On-site tastings & account visits",
      "Program-specific recommendations",
      "Consistent, hands-on support",
      "Direct line to sales leadership"
    ]
  },
  {
    icon: "🎓",
    title: "Education & Marketing",
    items: [
      "Staff training & brand stories",
      "High-fidelity sell sheets & shelf talkers",
      "Point-of-sale materials",
      "Marketing & promotional support",
      "Waitstaff education programs"
    ]
  },
  {
    icon: "🤖",
    title: "AI Sommelier (B2B)",
    items: [
      "Proprietary B2B discovery tool",
      "Menu-pairing recommendations",
      "Portfolio exploration based on profile",
      "Digital sommelier-at-hand",
      "Smart ordering integration"
    ]
  }
];

const MARKETS = [
  { market: "New York", type: "Direct Distribution", active: true },
  { market: "New Jersey", type: "Direct Distribution", active: true },
  { market: "Florida", type: "Direct Distribution", active: true },
  { market: "California", type: "Partner Network", active: false },
  { market: "Texas", type: "Partner Network", active: false },
  { market: "Illinois", type: "Partner Network", active: false },
  { market: "Pennsylvania", type: "Partner Network", active: false },
  { market: "Massachusetts", type: "Partner Network", active: false },
  { market: "& 18+ States", type: "National Access", active: false },
];

export default function ServicesPage() {
  const [audience, setAudience] = useState("suppliers");

  return (
    <div style={{ background: T.ink, color: T.paper }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.metal,
        padding: "160px 48px 100px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)"
        }} />
        <Reveal>
          <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold, marginBottom: "20px" }}>What We Do</p>
          <h1 style={{
            fontFamily: ff.h,
            fontSize: "clamp(48px, 7vw, 92px)",
            fontWeight: 400,
            color: T.paper,
            lineHeight: 0.95,
            marginBottom: "32px",
            textShadow: `0 10px 30px rgba(0,0,0,0.5)`
          }}>
            Full-Service Import<br />
            <em style={{ color: T.gold }}>& Distribution</em>
          </h1>
          <p style={{
            fontFamily: ff.b,
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.75
          }}>
            From compliance and logistics to market activation and sales growth — we handle the complexity so you can focus on the craft.
          </p>
        </Reveal>
      </section>

      {/* ── Audience Toggle ─────────────────────────────────────────────── */}
      <section style={{
        background: T.ink,
        padding: "80px 48px 20px",
        textAlign: "center",
        position: "sticky",
        top: "80px",
        zIndex: 10,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.glassBorder}`
      }}>
        <div style={{
          display: "inline-flex",
          gap: "8px",
          background: "rgba(0,0,0,0.3)",
          padding: "6px",
          borderRadius: "12px",
          border: `1px solid ${T.glassBorder}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.2)`
        }}>
          {[
            { id: "suppliers", label: "For Brands & Suppliers" },
            { id: "buyers", label: "For Buyers & Retailers" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAudience(t.id)}
              style={{
                fontFamily: ff.b,
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "1.5px",
                padding: "12px 32px",
                border: "none",
                borderRadius: "6px",
                background: audience === t.id ? T.wine : "transparent",
                color: audience === t.id ? T.paper : T.muted,
                cursor: "pointer",
                transition: "all 0.4s",
                textTransform: "uppercase"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Services Content ────────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <Hr w="40px" c={T.gold} style={{ margin: "0 auto 24px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(36px, 5vw, 56px)", color: T.paper, lineHeight: 1.1, marginBottom: "24px" }}>
                {audience === "suppliers" 
                  ? "Your Partner for US Market Entry"
                  : "A Curated Portfolio, Backed by Real Support"}
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
                {audience === "suppliers"
                  ? "We don't just move boxes — we build brands. Every supplier relationship is a commitment to market strategy, transparency, and execution."
                  : "From wine bars to retail chains, we make it easy to discover, order, and grow your program with authentic, high-quality products."}
              </p>
            </div>
          </Reveal>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
            {(audience === "suppliers" ? SUPPLIER_SERVICES : BUYER_SERVICES).map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div style={{
                  padding: "48px",
                  background: T.glass,
                  border: `1px solid ${T.glassBorder}`,
                  borderRadius: "16px",
                  borderTop: `4px solid ${audience === "suppliers" ? T.wine : T.gold}`,
                  height: "100%",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "24px", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.1))" }}>{s.icon}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>{s.title}</h3>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {s.items.map((item) => (
                      <li key={item} style={{
                        fontFamily: ff.b,
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.6)",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        lineHeight: 1.7
                      }}>
                        <span style={{ color: audience === "suppliers" ? T.wine : T.gold, flexShrink: 0, marginTop: "4px", fontSize: "12px" }}>◆</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Distribution Map Segment ────────────────────────────────────── */}
      <section style={{
        background: T.metal,
        padding: "120px 48px",
        color: T.paper,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "5px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>Network</p>
              <h2 style={{ fontFamily: ff.h, fontSize: "36px" }}>Our Market Footprint</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {MARKETS.map((m) => (
              <Reveal key={m.market}>
                <div style={{
                  padding: "32px",
                  borderRadius: "12px",
                  background: m.active ? T.wine : T.glass,
                  border: m.active ? `1px solid ${T.wine}` : `1px solid ${T.glassBorder}`,
                  textAlign: "center",
                  boxShadow: m.active ? `0 0 20px ${T.wine}40` : "none",
                  transition: "all 0.4s"
                }}>
                  <p style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "8px" }}>{m.market}</p>
                  <p style={{ 
                    fontFamily: ff.b, 
                    fontSize: "10px", 
                    letterSpacing: "3px", 
                    textTransform: "uppercase", 
                    color: m.active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" 
                  }}>{m.type}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 48px", background: T.bg }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <Hr w="40px" c={T.gold} style={{ margin: "0 auto 24px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "44px", color: T.paper }}>The Vinaio Way</h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px" }}>
            {[
              { n: "01", t: "Discovery", d: "We learn your brand, goals, and market profile through a detailed consultation." },
              { n: "02", t: "Strategy", d: "Tailored compliance roadmap, positioning, and go-to-market plan." },
              { n: "03", t: "Execution", d: "Logistics, warehousing, and deployment across target markets." },
              { n: "04", t: "Activation", d: "Ongoing sales management, account tastings, and portfolio growth." }
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: ff.h, fontSize: "56px", color: T.gold, opacity: 0.6, marginBottom: "16px", textShadow: `0 0 20px ${T.gold}20` }}>{s.n}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "12px" }}>{s.t}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.ink,
        padding: "120px 48px",
        textAlign: "center",
        borderTop: `1px solid ${T.glassBorder}`
      }}>
        <Reveal>
          <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 5vw, 56px)", color: T.paper, marginBottom: "24px" }}>
            Let&apos;s Build Together
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "500px", margin: "0 auto 48px", lineHeight: 1.8 }}>
            Ready to learn how Vinaio can represent your brand or support your business? Let&apos;s talk.
          </p>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{
              fontFamily: ff.b,
              fontSize: "11px",
              letterSpacing: "4px",
              color: T.paper,
              background: T.wine,
              padding: "18px 44px",
              display: "inline-block",
              textTransform: "uppercase",
              fontWeight: 600,
              boxShadow: `0 10px 30px ${T.wine}40`
            }}>
              Contact Us
            </Link>
            <Link href="/portfolio" style={{
              fontFamily: ff.b,
              fontSize: "11px",
              letterSpacing: "4px",
              color: T.paper,
              border: `1px solid ${T.glassBorder}`,
              background: T.glass,
              padding: "18px 44px",
              display: "inline-block",
              textTransform: "uppercase",
              fontWeight: 600,
              backdropFilter: "blur(10px)"
            }}>
              Explore Portfolio
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
