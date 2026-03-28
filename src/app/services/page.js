import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Services — Vinaio Imports | Import, Distribution, Logistics & White Label",
  description:
    "Full-service beverage alcohol partner. TTB licensing, logistics, 26-state distribution (self-dist NY/NJ/FL), white label wines & spirits, compliance management. Same services as Park Street and MHW.",
};

const SERVICES = [
  {
    icon: "◈",
    title: "Import & Compliance",
    color: T.wine,
    bullets: [
      "TTB Importer's Basic Permit",
      "COLA (Certificate of Label Approval) registration",
      "Federal & state label approvals",
      "Certificate of origin management",
      "US Customs documentation & clearance",
      "State-by-state product registration",
    ],
    detail:
      "We are a fully licensed TTB importer. Our compliance team manages the complete regulatory lifecycle — from initial label approval to annual reporting — so your brand is market-ready and stays compliant.",
  },
  {
    icon: "◉",
    title: "Logistics & Warehousing",
    color: T.blue,
    bullets: [
      "Bonded & licensed warehouse facilities",
      "Temperature-controlled wine & spirits storage",
      "Full inventory management & reporting",
      "International freight coordination",
      "Domestic LTL & full-truck delivery",
      "Third-party logistics (3PL) integration",
    ],
    detail:
      "From port of entry to final delivery, our logistics infrastructure handles your product with the precision it deserves. Real-time inventory visibility through the Customer Portal.",
  },
  {
    icon: "◎",
    title: "Distribution Network",
    color: T.green,
    bullets: [
      "Self-distribution: New York, New Jersey, Florida",
      "Distributor network: 26 states",
      "On-premise: restaurants, hotels, bars, clubs",
      "Off-premise: retail chains, wine shops, grocery",
      "E-commerce & direct-to-consumer channels",
      "National account program management",
    ],
    detail:
      "Our 26-state reach is powered by a curated network of best-in-class distributor partners, with direct self-distribution in our three core markets — NY, NJ, and FL.",
  },
  {
    icon: "✦",
    title: "White Label",
    color: T.gold,
    bullets: [
      "Custom-branded wines (red, white, rosé, sparkling)",
      "Private-label spirits: rum, whisky, vodka, gin",
      "White-label craft beer & malt beverages",
      "Custom label design & packaging",
      "Contract production sourcing worldwide",
      "Minimum order quantities from 100 cases",
    ],
    detail:
      "Launch your own branded beverage line without the complexity. We source, produce, label, import, and distribute — you sell under your brand. Ideal for restaurants, hotel groups, retailers, and event companies.",
  },
  {
    icon: "◆",
    title: "Brand Support",
    color: T.deep,
    bullets: [
      "US market entry strategy & pricing analysis",
      "Dedicated Vinaio sales rep assignment",
      "Trade show representation",
      "On-premise menu & placement programs",
      "Retailer sell-sheets & marketing materials",
      "Quarterly business reviews & growth planning",
    ],
    detail:
      "We go beyond logistics. Our sales team works as an extension of your brand — building relationships with buyers, securing placements, and growing your US revenue.",
  },
  {
    icon: "◷",
    title: "Compliance Management",
    color: T.orange,
    bullets: [
      "State liquor license renewals (for your account)",
      "Federal Basic Permit monitoring",
      "Distributor agreement drafting & management",
      "Annual TTB reporting",
      "License expiration alerts & renewal coordination",
      "Document repository in Customer Portal",
    ],
    detail:
      "Ongoing compliance is often an afterthought — until a license expires. Our compliance dashboard keeps your licenses, permits, and agreements current and visible at all times.",
  },
];

const COMPARE = [
  { feature: "Licensed TTB Importer",          vinaio: true, parkst: true, mhw: true  },
  { feature: "Bonded Warehouse",               vinaio: true, parkst: true, mhw: true  },
  { feature: "White Label Program",            vinaio: true, parkst: true, mhw: false },
  { feature: "Self-Distribution (NY/NJ/FL)",   vinaio: true, parkst: false,mhw: false },
  { feature: "Caribbean & Latin Specialty",    vinaio: true, parkst: false,mhw: false },
  { feature: "Spain & Europe Import Program",  vinaio: true, parkst: false,mhw: false },
  { feature: "Customer Portal (AI-powered)",   vinaio: true, parkst: false,mhw: false },
  { feature: "26-State Network",               vinaio: true, parkst: true, mhw: true  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "70vh",
          background: T.ink,
          display: "flex",
          alignItems: "flex-end",
          padding: "140px 56px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 70% at 70% 50%, ${T.wineDeep}45 0%, transparent 55%)`,
          }}
        />
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
            <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold, marginBottom: "16px" }}>
              Our Services
            </p>
            <h1 style={{ fontFamily: ff.h, fontSize: "clamp(44px, 6vw, 80px)", color: T.paper, lineHeight: 0.92, marginBottom: "28px" }}>
              Full-Service<br />
              <em>Beverage Alcohol Partner</em>
            </h1>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.5)", maxWidth: "520px", lineHeight: 1.8 }}>
              Everything Park Street and MHW offer — plus boutique attention,
              Caribbean expertise, and exclusive European import capabilities.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Territory Bar ─────────────────────────────────────────────────── */}
      <section style={{ background: T.wine, padding: "32px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          {[
            { label: "Self-Distribution", value: "New York · New Jersey · Florida" },
            { label: "Distributor Network", value: "26 States & Growing" },
            { label: "Channels", value: "On-Premise & Off-Premise" },
            { label: "White Label MOQ", value: "From 100 Cases" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>{s.label}</p>
              <p style={{ fontFamily: ff.h, fontSize: "18px", color: T.paper }}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Six Services ──────────────────────────────────────────────────── */}
      <section style={{ background: T.bg, padding: "100px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div
                  style={{
                    padding: "40px 32px",
                    background: T.paper,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "10px",
                    borderTop: `3px solid ${s.color}`,
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: `${s.color}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        color: s.color,
                        flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </div>
                    <h3 style={{ fontFamily: ff.b, fontSize: "16px", fontWeight: 600, color: T.ink }}>{s.title}</h3>
                  </div>
                  <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, lineHeight: 1.7, marginBottom: "20px" }}>{s.detail}</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {s.bullets.map((b) => (
                      <li key={b} style={{ fontFamily: ff.b, fontSize: "12px", color: T.deep, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ color: s.color, flexShrink: 0, marginTop: "2px" }}>→</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "100px 56px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 20px" }} />
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(28px, 4vw, 44px)", color: T.ink, marginBottom: "16px" }}>
                How We Compare
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, maxWidth: "400px", margin: "0 auto", lineHeight: 1.8 }}>
                Same full-service capabilities as the industry leaders — with capabilities they don&apos;t offer.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div style={{ background: T.bg, border: `1px solid ${T.cream}`, borderRadius: "10px", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px", padding: "16px 24px", background: T.cream, gap: "8px" }}>
                <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted }}>Feature</span>
                {["Vinaio", "Park Street", "MHW"].map((h) => (
                  <span key={h} style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: h === "Vinaio" ? T.wine : T.muted, textAlign: "center" }}>{h}</span>
                ))}
              </div>
              {COMPARE.map((row, i) => (
                <div
                  key={row.feature}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 120px 120px 120px",
                    padding: "16px 24px",
                    gap: "8px",
                    alignItems: "center",
                    borderBottom: i < COMPARE.length - 1 ? `1px solid ${T.cream}` : "none",
                    background: i % 2 === 0 ? T.bg : T.paper,
                  }}
                >
                  <span style={{ fontFamily: ff.b, fontSize: "13px", color: T.ink }}>{row.feature}</span>
                  {[row.vinaio, row.parkst, row.mhw].map((v, ci) => (
                    <div key={ci} style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "16px", color: v ? (ci === 0 ? T.green : T.muted) : T.taupe }}>
                        {v ? "✓" : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── White Label Highlight ─────────────────────────────────────────── */}
      <section style={{ background: T.ink, padding: "100px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <Reveal>
              <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
              <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: T.gold, marginBottom: "16px" }}>White Label Program</p>
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4vw, 52px)", color: T.paper, lineHeight: 1.0, marginBottom: "24px" }}>
                Launch your own brand
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "32px" }}>
                Vinaio&apos;s white label program lets restaurants, hotel groups,
                retailers, and event companies bring their own wine, spirits, or
                beer brand to market — fully sourced, compliant, and ready to sell.
              </p>
              <Link href="/contact" style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 600, color: T.ink, background: T.gold, border: `1px solid ${T.gold}`, padding: "16px 36px", display: "inline-block" }}>
                Start Your White Label Project
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { icon: "🍷", label: "Wine", desc: "Red, white, rosé, sparkling — sourced globally" },
                  { icon: "🥃", label: "Spirits", desc: "Rum, whisky, vodka, gin, and more" },
                  { icon: "🍺", label: "Beer & Malt", desc: "Craft lager, ale, and malt beverages" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "24px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <span style={{ fontSize: "28px" }}>{item.icon}</span>
                    <div>
                      <p style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.paper, marginBottom: "4px" }}>{item.label}</p>
                      <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.warm }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "100px 56px", textAlign: "center" }}>
        <Reveal>
          <Hr w="32px" c={T.wine} style={{ margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "clamp(28px, 4vw, 48px)", color: T.ink, marginBottom: "20px" }}>
            Start your import journey
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted, maxWidth: "440px", margin: "0 auto 40px", lineHeight: 1.8 }}>
            Whether you&apos;re a foreign producer seeking US market access, a retailer wanting a private label, or a brand looking for a distribution partner — let&apos;s talk.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 600, color: T.paper, background: T.wine, padding: "16px 40px" }}>
              Get in Touch
            </Link>
            <Link href="/portal" style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 500, color: T.wine, border: `1px solid ${T.taupe}`, padding: "16px 40px" }}>
              Customer Portal
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
