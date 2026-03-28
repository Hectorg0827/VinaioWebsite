"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          background: T.ink,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 70% at 50% 50%, ${T.wineDeep}55 0%, transparent 60%), linear-gradient(175deg, #0F0D0B 0%, ${T.ink} 40%, #1F1B17 100%)`,
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 48px",
          }}
        >
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transition: "all 1.2s ease 0.4s",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Hr w="40px" c={T.gold} />
            <span
              style={{
                fontFamily: ff.b,
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "6px",
                textTransform: "uppercase",
                color: T.gold,
              }}
            >
              Importers &amp; Distributors
            </span>
            <Hr w="40px" c={T.gold} />
          </div>

          <h1
            style={{
              fontFamily: ff.h,
              fontSize: "clamp(64px, 11vw, 140px)",
              fontWeight: 400,
              color: T.paper,
              lineHeight: 0.88,
              letterSpacing: "-3px",
              opacity: loaded ? 1 : 0,
              transition: "all 1.4s ease 0.2s",
              marginBottom: "24px",
            }}
          >
            Vinaio
          </h1>

          <p
            style={{
              fontFamily: ff.h,
              fontSize: "clamp(17px, 2.2vw, 22px)",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.35)",
              opacity: loaded ? 1 : 0,
              transition: "all 1.2s ease 0.6s",
              marginBottom: "56px",
            }}
          >
            The bridge between terroir &amp; the market
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              opacity: loaded ? 1 : 0,
              transition: "all 1.2s ease 0.9s",
            }}
          >
            {[
              { href: "/portfolio", label: "Explore Portfolio", primary: false },
              { href: "/portal",    label: "Customer Portal",   primary: true  },
              { href: "/spain",     label: "Spain & Europe",    primary: false },
            ].map(({ href, label, primary }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: ff.b,
                  fontSize: "10.5px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: primary ? T.ink : T.paper,
                  background: primary ? T.gold : "transparent",
                  border: `1px solid ${primary ? T.gold : "rgba(255,255,255,0.2)"}`,
                  padding: "16px 36px",
                  transition: "all 0.4s",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: loaded ? 0.4 : 0,
            transition: "opacity 1s ease 1.5s",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "48px",
              background: `linear-gradient(to bottom, transparent, ${T.gold})`,
              margin: "0 auto",
            }}
          />
        </div>
      </section>

      {/* ── Services Strip ───────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "80px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Hr w="32px" c={T.wine} style={{ margin: "0 auto 20px" }} />
              <h2
                style={{
                  fontFamily: ff.h,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  color: T.ink,
                  marginBottom: "16px",
                }}
              >
                Full-Service Partner
              </h2>
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "15px",
                  color: T.muted,
                  maxWidth: "560px",
                  margin: "0 auto",
                  lineHeight: 1.8,
                }}
              >
                The same suite of services as Park Street and MHW — with boutique
                attention and deep Caribbean &amp; Latin American expertise.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              { icon: "◈", title: "Import & Compliance",    desc: "TTB licensing, COLA registration, label approval, federal & state permits." },
              { icon: "◉", title: "Logistics & Warehousing", desc: "Bonded warehouse, temperature-controlled storage, freight coordination." },
              { icon: "◎", title: "26-State Distribution",   desc: "Self-distribution in NY, NJ & FL. Distributor network across 26 states." },
              { icon: "◆", title: "White Label",             desc: "Private-label wines, spirits, and beer — fully sourced and market-ready." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div
                  style={{
                    padding: "32px 28px",
                    background: T.bg,
                    border: `1px solid ${T.cream}`,
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      color: T.wine,
                      marginBottom: "16px",
                    }}
                  >
                    {s.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: ff.b,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: T.ink,
                      marginBottom: "10px",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: ff.b,
                      fontSize: "13px",
                      color: T.muted,
                      lineHeight: 1.7,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spain & Europe Callout ───────────────────────────────────────── */}
      <section
        style={{
          background: T.ink,
          padding: "100px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 60% at 80% 50%, ${T.wineDeep}40 0%, transparent 60%)`,
          }}
        />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          <div style={{ maxWidth: "600px" }}>
            <Reveal>
              <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "10px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: T.gold,
                  marginBottom: "20px",
                }}
              >
                Vinaio Spain &amp; Europe
              </p>
              <h2
                style={{
                  fontFamily: ff.h,
                  fontSize: "clamp(36px, 5vw, 60px)",
                  color: T.paper,
                  lineHeight: 1.1,
                  marginBottom: "24px",
                }}
              >
                Your gateway to the US market
              </h2>
              <p
                style={{
                  fontFamily: ff.b,
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.8,
                  marginBottom: "40px",
                }}
              >
                We serve as exclusive US importer for Spain and European craft
                producers — handling TTB licensing, COLA registration,
                warehousing, and 26-state distribution so you can focus on what
                you do best.
              </p>
              <Link
                href="/spain"
                style={{
                  display: "inline-block",
                  fontFamily: ff.b,
                  fontSize: "10.5px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: T.gold,
                  border: `1px solid ${T.gold}40`,
                  padding: "14px 32px",
                }}
              >
                Explore Vinaio Spain →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Territory ────────────────────────────────────────────────────── */}
      <section style={{ background: T.cream, padding: "80px 56px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ margin: "0 auto 24px" }} />
            <h2
              style={{
                fontFamily: ff.h,
                fontSize: "clamp(28px, 3.5vw, 42px)",
                color: T.ink,
                marginBottom: "40px",
              }}
            >
              Distribution Reach
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2px",
              background: T.taupe,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {[
              { label: "26 States", sub: "Distribution Network" },
              { label: "NY · NJ · FL", sub: "Self-Distribution" },
              { label: "On & Off Premise", sub: "Channel Coverage" },
              { label: "10+ Brands", sub: "Portfolio & Growing" },
            ].map((s) => (
              <Reveal key={s.label}>
                <div
                  style={{
                    padding: "40px 28px",
                    background: T.paper,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: ff.h,
                      fontSize: "clamp(28px, 3vw, 40px)",
                      color: T.wine,
                      marginBottom: "8px",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontFamily: ff.b,
                      fontSize: "10px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: T.muted,
                    }}
                  >
                    {s.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: T.paper, padding: "100px 56px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ margin: "0 auto 24px" }} />
            <h2
              style={{
                fontFamily: ff.h,
                fontSize: "clamp(32px, 4vw, 50px)",
                color: T.ink,
                marginBottom: "20px",
              }}
            >
              Ready to partner with Vinaio?
            </h2>
            <p
              style={{
                fontFamily: ff.b,
                fontSize: "14px",
                color: T.muted,
                lineHeight: 1.8,
                marginBottom: "40px",
              }}
            >
              Whether you&apos;re a retailer, restaurant, hotel, or international
              producer seeking US market access — let&apos;s talk.
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
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
                Get in Touch
              </Link>
              <Link
                href="/services"
                style={{
                  fontFamily: ff.b,
                  fontSize: "10.5px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: T.wine,
                  background: "transparent",
                  border: `1px solid ${T.taupe}`,
                  padding: "16px 36px",
                }}
              >
                Our Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: T.ink,
          padding: "48px 56px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: ff.h,
            fontSize: "18px",
            color: T.paper,
            letterSpacing: "5px",
            textTransform: "uppercase",
          }}
        >
          Vinaio
        </span>
        <p
          style={{
            fontFamily: ff.b,
            fontSize: "11px",
            color: T.warm,
            letterSpacing: "0.5px",
          }}
        >
          © {new Date().getFullYear()} Vinaio Imports. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            ["/portfolio", "Portfolio"],
            ["/spain",     "Spain & Europe"],
            ["/services",  "Services"],
            ["/contact",   "Contact"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: ff.b,
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: T.warm,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </>
  );
}
