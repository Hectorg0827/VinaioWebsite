import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "Vinaio Spain & Europe — Exclusive US Importer for Iberian & European Brands",
  description:
    "Vinaio acts as exclusive US importer for Spain and European craft producers. We handle TTB licensing, COLA registration, warehousing, and 26-state distribution.",
};

const EUROPE_PRODUCTS = PRODUCTS.filter((p) => p.region === "Europe");

const PILLARS = [
  {
    icon: "◈",
    title: "Import",
    subtitle: "End-to-end importation",
    points: [
      "TTB Importer's Basic Permit",
      "COLA (Certificate of Label Approval)",
      "US Customs clearance & freight",
      "Certificate of origin management",
      "State-level registration in all 26 states",
    ],
  },
  {
    icon: "◉",
    title: "Distribute",
    subtitle: "Market-ready from day one",
    points: [
      "Self-distribution: New York, New Jersey, Florida",
      "Distributor network: 26 states",
      "On-premise: restaurants, hotels, bars",
      "Off-premise: retail & specialty wine shops",
      "E-commerce channel partners",
    ],
  },
  {
    icon: "◆",
    title: "Grow",
    subtitle: "Brand building in the US",
    points: [
      "Market entry strategy & pricing",
      "Dedicated sales rep network",
      "Trade marketing & placement",
      "Account management & reporting",
      "White-label options available",
    ],
  },
];

const WHY = [
  { label: "No US entity required",          yes: true  },
  { label: "TTB & COLA handled for you",      yes: true  },
  { label: "Bonded warehouse included",       yes: true  },
  { label: "Sales team ready from launch",    yes: true  },
  { label: "26-state coverage from day one",  yes: true  },
  { label: "Single point of contact",         yes: true  },
];

export default function SpainPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          background: T.ink,
          display: "flex",
          alignItems: "center",
          padding: "140px 56px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 80% at 20% 60%, ${T.wineDeep}50 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 85% 30%, ${T.gold}08 0%, transparent 50%)`,
          }}
        />
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative" }}>
          <div style={{ maxWidth: "680px" }}>
            <Reveal>
              <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
              <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold, marginBottom: "20px" }}>
                Vinaio Spain &amp; Europe
              </p>
              <h1
                style={{
                  fontFamily: ff.h,
                  fontSize: "clamp(48px, 7vw, 88px)",
                  color: T.paper,
                  lineHeight: 0.92,
                  marginBottom: "32px",
                }}
              >
                Your Gateway<br />
                <em>to the US Market</em>
              </h1>
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.8,
                  marginBottom: "48px",
                  maxWidth: "520px",
                }}
              >
                We serve as exclusive US importer and distributor for Spain and
                European craft producers — handling every step from TTB licensing
                to last-mile delivery so you can focus on making exceptional wine
                and spirits.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link
                  href="/contact"
                  style={{
                    fontFamily: ff.b,
                    fontSize: "10.5px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: T.paper,
                    background: T.wine,
                    border: `1px solid ${T.wine}`,
                    padding: "16px 36px",
                  }}
                >
                  Talk to Us
                </Link>
                <Link
                  href="/services"
                  style={{
                    fontFamily: ff.b,
                    fontSize: "10.5px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: T.gold,
                    background: "transparent",
                    border: `1px solid ${T.gold}40`,
                    padding: "16px 36px",
                  }}
                >
                  All Services →
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Floating stats */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {[
              { n: "26", label: "States" },
              { n: "3",  label: "Self-Dist." },
              { n: "1",  label: "Point of Contact" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  width: "110px",
                  padding: "20px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontFamily: ff.h, fontSize: "32px", color: T.gold }}>{s.n}</p>
                <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginTop: "4px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three Pillars ─────────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "100px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 20px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4vw, 48px)", color: T.ink, marginBottom: "16px" }}>
                From Cellar to Consumer
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, maxWidth: "480px", margin: "0 auto", lineHeight: 1.8 }}>
                We handle the entire US market entry journey — compliance, logistics, and sales growth.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: "40px 32px",
                    background: T.bg,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "10px",
                    borderTop: `3px solid ${T.wine}`,
                  }}
                >
                  <div style={{ fontSize: "20px", color: T.wine, marginBottom: "16px" }}>{p.icon}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.ink, marginBottom: "4px" }}>{p.title}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.warm, marginBottom: "24px", letterSpacing: "1px", textTransform: "uppercase" }}>{p.subtitle}</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {p.points.map((pt) => (
                      <li key={pt} style={{ fontFamily: ff.b, fontSize: "13px", color: T.deep, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ color: T.green, flexShrink: 0, marginTop: "2px" }}>✓</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured European Brands ──────────────────────────────────────── */}
      {EUROPE_PRODUCTS.length > 0 && (
        <section style={{ background: T.bg, padding: "80px 56px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
                <Hr w="32px" c={T.wine} />
                <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>
                  European Brands in Our Portfolio
                </h2>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {EUROPE_PRODUCTS.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <div style={{ padding: "28px 24px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
                    <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.wine, display: "block", marginBottom: "10px" }}>
                      {p.category} · {p.origin}
                    </span>
                    <h3 style={{ fontFamily: ff.h, fontSize: "20px", color: T.ink, marginBottom: "8px" }}>{p.name}</h3>
                    <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.7, marginBottom: "16px" }}>{p.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: ff.h, fontSize: "18px", color: T.wine }}>${p.price}</span>
                      <Link href="/contact" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: T.wine, border: `1px solid ${T.wine}30`, padding: "7px 14px", borderRadius: "4px" }}>
                        Inquire
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Vinaio Spain ──────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "100px 56px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 20px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4vw, 48px)", color: T.ink, marginBottom: "16px" }}>
                Why Vinaio Spain?
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, maxWidth: "440px", margin: "0 auto", lineHeight: 1.8 }}>
                Bringing your brand to the US alone requires months of legal
                work, investment, and relationships. We remove that friction.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Going it alone */}
            <Reveal>
              <div style={{ padding: "32px", background: T.bg, border: `1px solid ${T.cream}`, borderRadius: "10px" }}>
                <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>Going direct (typical)</p>
                {[
                  "Form a US importer entity (months + legal fees)",
                  "Apply for TTB Basic Permit (4–6 months)",
                  "Register labels state by state",
                  "Find and contract distributors yourself",
                  "Build a sales team from scratch",
                  "Manage compliance reporting ongoing",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
                    <span style={{ color: T.red, flexShrink: 0, marginTop: "1px" }}>✕</span>
                    <span style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Vinaio Spain */}
            <Reveal delay={0.1}>
              <div style={{ padding: "32px", background: T.ink, border: `1px solid ${T.wine}30`, borderRadius: "10px" }}>
                <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.gold, marginBottom: "20px" }}>With Vinaio Spain</p>
                {WHY.map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
                    <span style={{ color: T.green, flexShrink: 0, marginTop: "1px" }}>✓</span>
                    <span style={{ fontFamily: ff.b, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Producer CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: T.wine, padding: "80px 56px", textAlign: "center" }}>
        <Reveal>
          <Hr w="32px" c="rgba(255,255,255,0.3)" style={{ margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4vw, 52px)", color: T.paper, marginBottom: "20px" }}>
            Ready to enter the US market?
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.7)", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.8 }}>
            We work with a selective group of Spanish and European producers.
            Tell us about your brand and we&apos;ll be in touch within 48 hours.
          </p>
          <Link
            href="/contact"
            style={{
              fontFamily: ff.b,
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 600,
              color: T.wine,
              background: T.paper,
              border: `1px solid ${T.paper}`,
              padding: "18px 44px",
              display: "inline-block",
            }}
          >
            Contact Our Spain Team
          </Link>
        </Reveal>
      </section>
    </>
  );
}
