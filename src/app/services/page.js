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
    <div style={{ background: T.paper }}>
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
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 400,
            color: T.ink,
            lineHeight: 1,
            marginBottom: "32px"
          }}>
            Full-Service Import<br />
            <em style={{ color: T.wine }}>& Distribution</em>
          </h1>
          <p style={{
            fontFamily: ff.b,
            fontSize: "18px",
            color: T.muted,
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
        background: T.paper,
        padding: "60px 48px 0",
        borderBottom: `1px solid ${T.cream}`,
        textAlign: "center",
        position: "sticky",
        top: "80px",
        zIndex: 10
      }}>
        <div style={{
          display: "inline-flex",
          gap: "8px",
          background: T.bg,
          padding: "6px",
          borderRadius: "8px",
          boxShadow: `0 4px 12px ${T.ink}08`
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
              <Hr w="40px" c={T.wine} style={{ margin: "0 auto 24px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(36px, 5vw, 52px)", color: T.ink, lineHeight: 1.1, marginBottom: "20px" }}>
                {audience === "suppliers" 
                  ? "Your Partner for US Market Entry"
                  : "A Curated Portfolio, Backed by Real Support"}
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "17px", color: T.muted, maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
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
                  background: T.paper,
                  border: `1px solid ${T.cream}`,
                  borderRadius: "10px",
                  borderTop: `4px solid ${audience === "suppliers" ? T.wine : T.gold}`,
                  height: "100%"
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "24px" }}>{s.icon}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.ink, marginBottom: "20px" }}>{s.title}</h3>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {s.items.map((item) => (
                      <li key={item} style={{
                        fontFamily: ff.b,
                        fontSize: "14px",
                        color: T.deep,
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        lineHeight: 1.6
                      }}>
                        <span style={{ color: audience === "suppliers" ? T.wine : T.gold, flexShrink: 0, marginTop: "4px" }}>→</span>
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
        color: T.ink,
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
                  borderRadius: "8px",
                  background: m.active ? T.wine : "rgba(0,0,0,0.03)",
                  border: m.active ? "none" : "1px solid rgba(0,0,0,0.08)",
                  textAlign: "center"
                }}>
                  <p style={{ fontFamily: ff.h, fontSize: "22px", marginBottom: "8px", color: m.active ? T.paper : T.ink }}>{m.market}</p>
                  <p style={{ 
                    fontFamily: ff.b, 
                    fontSize: "10px", 
                    letterSpacing: "2px", 
                    textTransform: "uppercase", 
                    color: m.active ? "rgba(255,255,255,0.7)" : T.muted 
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
              <Hr w="40px" c={T.wine} style={{ margin: "0 auto 24px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "40px", color: T.ink }}>The Vinaio Way</h2>
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
                  <div style={{ fontFamily: ff.h, fontSize: "48px", color: T.gold, opacity: 0.5, marginBottom: "16px" }}>{s.n}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "12px" }}>{s.t}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, lineHeight: 1.6 }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.paper,
        padding: "100px 48px",
        textAlign: "center",
        borderTop: `1px solid ${T.cream}`
      }}>
        <Reveal>
          <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 5vw, 52px)", color: T.ink, marginBottom: "20px" }}>
            Let&apos;s Build Together
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "18px", color: T.muted, maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.75 }}>
            Ready to learn how Vinaio can represent your brand or support your business? Let&apos;s talk.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{
              fontFamily: ff.b,
              fontSize: "11px",
              letterSpacing: "4px",
              color: T.paper,
              background: T.wine,
              padding: "18px 44px",
              display: "inline-block",
              textTransform: "uppercase",
              fontWeight: 600
            }}>
              Contact Us
            </Link>
            <Link href="/portfolio" style={{
              fontFamily: ff.b,
              fontSize: "11px",
              letterSpacing: "4px",
              color: T.wine,
              border: `1px solid ${T.taupe}`,
              padding: "18px 44px",
              display: "inline-block",
              textTransform: "uppercase",
              fontWeight: 600
            }}>
              Explore Portfolio
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
