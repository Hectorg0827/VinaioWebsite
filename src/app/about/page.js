"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Reveal from "@/components/Reveal";
import Hr from "@/components/Hr";
import Link from "next/link";
import ScrollLine from "@/components/ScrollLine";
import { createClient } from "@/lib/supabase/client";

const STATS = [
  { number: "26+", label: "Years of Experience" },
  { number: "26+", label: "Distribution Partners" },
  { number: "90+", label: "Brands & Suppliers" },
  { number: "580+", label: "SKUs in Portfolio" },
];

const FALLBACK_LEADERSHIP = [
  { initials: "FL", name: "Franlyn Liriano", title: "Chief Financial Officer", desc: "Oversees all financial operations, reporting, and fiscal strategy." },
  { initials: "CJ", name: "Carlos Jiménez", title: "VP of Compliance", desc: "Manages federal and state regulatory compliance across all 50 states." },
  { initials: "SE", name: "Sandro Estrella", title: "Portfolio Director — Wines & Spirits", desc: "Leads portfolio strategy and supplier relationships." },
  { initials: "HG", name: "Hector Garcia", title: "Portfolio Director — Beer & Sales Director, Vinaio Spain", desc: "Manages the beer portfolio and Caribbean brand division." },
  { initials: "LC", name: "Leandro Caseres", title: "Logistics Officer", desc: "Coordinates the full logistics pipeline from international freight to warehouse." },
  { initials: "SM", name: "Scarlet Matos", title: "Head of Order Department", desc: "Leads order management and fulfillment operations." }
];

const FALLBACK_SALES = [
  "Johnny Paulino", "Kelvin Felix", "Jazmin Collado", "Carlos Hidalgo",
  "Sandro Estrella", "Ramón Delmonte", "Jesús Gutiérrez", "Dan Kessler",
  "Dulce Baldera", "Marco Vivona", "Eduardo Salanova", "Miguel Henríquez"
];

const FALLBACK_ADVISORS = [
  { name: "César Baeza", role: "Wine Master" },
  { name: "Marco Vivona", role: "Portfolio Manager — France, Italy & South America" },
  { name: "Jesús Gutiérrez", role: "Nariz de Oro" }
];

export default function AboutPage() {
  const [team, setTeam] = useState({ executive: [], leadership: [], sales: [], advisor: [] });
  const [useFallback, setUseFallback] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const { data, error } = await supabase
        .from("site_team")
        .select("*")
        .eq("active", true)
        .order("order", { ascending: true });

      if (error || !data || data.length === 0) {
        setUseFallback(true);
        return;
      }

      const grouped = data.reduce((acc, m) => {
        const lv = m.level || "sales";
        if (!acc[lv]) acc[lv] = [];
        acc[lv].push(m);
        return acc;
      }, { executive: [], leadership: [], sales: [], advisor: [] });

      setTeam(grouped);
      setUseFallback(false);
    } catch (err) {
      setUseFallback(true);
    }
  };

  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div style={{ background: T.ink, color: T.paper }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.metal,
        padding: "160px 48px 120px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 20% 80%, ${T.wine} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${T.wine} 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        <Reveal>
          <p style={{ fontFamily: ff.b, fontSize: "12px", letterSpacing: "5px", color: T.gold, marginBottom: "24px", textTransform: "uppercase" }}>
            Est. 1998 · New York City
          </p>
          <h1 style={{
            fontFamily: ff.h,
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 400,
            color: T.paper,
            lineHeight: 1,
            maxWidth: "900px",
            margin: "0 auto 32px"
          }}>
            Bridging Continents<br />
            <em style={{ color: T.gold }}>Through Craft & Culture</em>
          </h1>
          <p style={{
            fontFamily: ff.b,
            fontSize: "20px",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.7
          }}>
            For over 26 years, Vinaio Imports has connected world-class producers with the American palate — building a transatlantic bridge from origin to shelf.
          </p>
        </Reveal>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.ink,
        padding: "80px 48px",
        borderBottom: `1px solid ${T.glassBorder}`
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "40px"
        }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.2}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: ff.h, fontSize: "64px", color: T.gold, lineHeight: 1, textShadow: `0 0 20px ${T.wine}40` }}>{s.number}</div>
                <div style={{ fontFamily: ff.b, fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "3px", marginTop: "16px", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ScrollLine height="140px" color={T.wine} bgColor={`${T.wine}10`} nodeBg={T.ink} />

      {/* ── Story ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 48px 120px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "80px", alignItems: "start" }}>
            <Reveal>
              <Hr w="40px" c={T.gold} style={{ marginBottom: "24px" }} />
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "4px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>Our Story</p>
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(36px, 5vw, 52px)", color: T.paper, lineHeight: 1.1, marginBottom: "32px" }}>
                Born in New York,<br />
                Rooted Across Borders
              </h2>
              <p style={{ fontFamily: ff.b, fontSize: "17px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, marginBottom: "20px" }}>
                Vinaio Imports was founded with a singular vision: to bring the finest wines, spirits, and specialty beverages from around the world to the American market — while doing so with the care, cultural understanding, and hands-on service that only a boutique importer can provide.
              </p>
              <p style={{ fontFamily: ff.b, fontSize: "17px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}>
                Headquartered in New York City with offices in Spain, we operate on both sides of the Atlantic. This dual presence gives us an unmatched ability to work directly with producers and manage quality from origin to shelf.
              </p>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <Reveal delay={0.2}>
                <div style={{ background: T.glass, backdropFilter: "blur(10px)", padding: "40px", borderLeft: `2px solid ${T.wine}`, borderRight: `1px solid ${T.glassBorder}`, borderTop: `1px solid ${T.glassBorder}`, borderBottom: `1px solid ${T.glassBorder}`, borderRadius: "4px" }}>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "16px" }}>Our Mission</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                    To champion exceptional producers from across the globe, delivering their craft to the US market with integrity, strategic expertise, and the personal attention that transforms a transaction into a lasting partnership.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div style={{ background: T.glass, backdropFilter: "blur(10px)", padding: "40px", borderLeft: `2px solid ${T.gold}`, borderRight: `1px solid ${T.glassBorder}`, borderTop: `1px solid ${T.glassBorder}`, borderBottom: `1px solid ${T.glassBorder}`, borderRadius: "4px" }}>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "16px" }}>The Dual Advantage</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                    Few importers operate on both continents. With Vinaio Spain SL as our European arm, we don't just import — we source, curate, and manage the full supply chain from producer to port.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reach ─────────────────────────────────────────────────────────── */}
      <div style={{ background: T.ink, padding: "40px 0" }}>
        <ScrollLine height="100px" color={T.gold} bgColor={"rgba(255,255,255,0.05)"} nodeBg={T.ink} />
      </div>
      <section style={{
        background: T.metal,
        padding: "120px 48px",
        color: T.paper,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "5px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>Our Reach</p>
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1 }}>A Transatlantic Distribution Network</h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "40px" }}>
             <Reveal>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "48px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", height: "100%" }}>
                <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>United States</p>
                <h3 style={{ fontFamily: ff.h, fontSize: "32px", marginBottom: "24px" }}>Full-Service Distribution</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Direct markets in NY, NJ, and FL with a national network spanning all major US metropolitan areas.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ background: "rgba(122, 24, 54, 0.1)", padding: "48px", borderRadius: "8px", border: `1px solid ${T.wine}30`, height: "100%" }}>
                <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", color: T.wineGlow, marginBottom: "16px", textTransform: "uppercase" }}>Spain & Europe</p>
                <h3 style={{ fontFamily: ff.h, fontSize: "32px", marginBottom: "24px" }}>Origin-Side Operations</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Vinaio Spain SL manages sourcing and export logistics directly from Europe, ensuring unmatched quality control.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Leadership ────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 48px", background: T.ink }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "5px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>Leadership</p>
              <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 4vw, 48px)", color: T.paper }}>The Team Behind Vinaio</h2>
            </div>
          </Reveal>

          {/* Executive (CEO) */}
          {(useFallback || (team.executive && team.executive.length > 0)) && (
            <Reveal>
              {(useFallback || !team.executive || team.executive.length === 0
                ? [{ name: "Joan Altés", role: "Chief Executive Officer & Owner", desc: "Founder and visionary behind Vinaio Imports, Joan has built the company from the ground up into a transatlantic import and distribution operation.", photo_url: "" }] 
                : team.executive
              ).map(m => (
                <div key={m.name} style={{
                  background: T.glass, borderRadius: "12px", padding: "60px", marginBottom: "60px",
                  display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap",
                  border: `1px solid ${T.glassBorder}`,
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 10px 40px rgba(0,0,0,0.3)`
                }}>
                  <div style={{
                    width: "180px", height: "180px", borderRadius: "50%",
                    background: m.photo_url ? `url(${m.photo_url}) center/cover` : T.wine,
                    border: `2px solid ${T.gold}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: ff.h, fontSize: "60px", color: T.paper, flexShrink: 0, overflow: "hidden",
                    boxShadow: `0 0 30px ${T.wine}40`
                  }}>
                    {!m.photo_url && getInitials(m.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", letterSpacing: "4px", color: T.gold, marginBottom: "12px", textTransform: "uppercase" }}>Executive Leadership</p>
                    <h3 style={{ fontFamily: ff.h, fontSize: "48px", color: T.paper, marginBottom: "20px" }}>{m.name}</h3>
                    <p style={{ fontFamily: ff.b, fontSize: "18px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>{m.desc || m.role}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          )}

          {/* Leadership Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {(useFallback || !team.leadership || team.leadership.length === 0 
               ? FALLBACK_LEADERSHIP 
               : team.leadership
            ).map((m, i) => (
              <Reveal key={m.name} delay={i * 0.15}>
                <div style={{
                  background: T.glass, border: `1px solid ${T.glassBorder}`, padding: "40px", borderRadius: "12px",
                  display: "flex", gap: "24px", alignItems: "flex-start", height: "100%",
                  backdropFilter: "blur(10px)", transition: "transform 0.4s",
                  cursor: "default"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%",
                    background: m.photo_url ? `url(${m.photo_url}) center/cover` : `${T.wine}25`,
                    border: `1px solid ${T.gold}20`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: ff.h, fontSize: "20px", color: T.paper, flexShrink: 0, overflow: "hidden"
                  }}>
                    {!m.photo_url && (m.initials || getInitials(m.name))}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: ff.h, fontSize: "22px", color: T.paper, marginBottom: "4px" }}>{m.name}</h4>
                    <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "1.5px", color: T.gold, fontWeight: 600, textTransform: "uppercase", marginBottom: "12px" }}>{m.role || m.title}</p>
                    <p style={{ fontFamily: ff.b, fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{m.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sales Team ────────────────────────────────────────────────────── */}
      <section style={{ background: T.ink, padding: "120px 48px", borderTop: `1px solid ${T.glassBorder}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{
              background: T.metal,
              borderRadius: "12px",
              padding: "80px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "5px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>On the Ground</p>
              <h2 style={{ fontFamily: ff.h, fontSize: "36px", color: T.paper, marginBottom: "12px" }}>Our Sales Team</h2>
              <p style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.4)", maxWidth: "520px", margin: "0 auto 48px", lineHeight: 1.7 }}>
                The backbone of Vinaio — our reps bring deep market knowledge and personal relationships to every territory.
              </p>
              
              {/* If we have dynamic sales members with photos, show them differently? */}
              {/* For now, maintain the badge-style list if they have no photos, or grid if they do */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
                {(useFallback ? FALLBACK_SALES : team.sales).map((m, i) => {
                  const name = typeof m === "string" ? m : m.name;
                  const photo = typeof m === "string" ? null : m.photo_url;
                  
                  return (
                    <Reveal key={name} delay={i * 0.1}>
                      <div style={{
                        padding: "8px 24px 8px 8px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "40px",
                        display: "flex", alignItems: "center", gap: "12px",
                        transition: "all 0.3s"
                      }}>
                        <div style={{ 
                          width: "36px", height: "36px", borderRadius: "50%", 
                          background: photo ? `url(${photo}) center/cover` : T.wine,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: ff.h, fontSize: "11px", color: "white", flexShrink: 0, overflow: "hidden",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                        }}>
                          {!photo && getInitials(name)}
                        </div>
                        <span style={{ fontFamily: ff.h, fontSize: "13px", color: T.paper, letterSpacing: "0.5px" }}>{name}</span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
              </div>
            </div>
        </div>
      </section>

      <section style={{ padding: "120px 48px", background: T.ink }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "40px" }}>

          <div style={{ background: T.glass, backdropFilter: "blur(10px)", padding: "48px", border: `1px solid ${T.glassBorder}`, borderTop: `4px solid ${T.gold}`, height: "100%", borderRadius: "12px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>Advisors</p>
              <h3 styl                         color: "rgba(255,255,255,0.8)"
                      }}>
                        {!a.photo_url && getInitials(a.name)}
                      </div>
                      <div>
                        <p style={{ fontFamily: ff.h, fontSize: "18px", color: T.paper, marginBottom: "2px" }}>{a.name}</p>
                        <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.gold, fontWeight: 600, textTransform: "uppercase" }}>{a.role}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
            <div style={{ background: T.glass, backdropFilter: "blur(10px)", padding: "48px", border: `1px solid ${T.glassBorder}`, borderTop: `4px solid ${T.wine}`, height: "100%", borderRadius: "12px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "3px", color: T.wine, marginBottom: "16px", textTransform: "uppercase" }}>Administration</p>
              <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>Built for a Complex World</h3>
              <p style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                Our staff operates across languages, cultures, and regulatory environments with fluency, ensuring seamless operations from producer to glass.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.metal,
        padding: "120px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <h2 style={{ fontFamily: ff.h, fontSize: "clamp(32px, 5vw, 48px)", color: T.paper, marginBottom: "20px" }}>
            Ready to Build Your Brand?
          </h2>
          <p style={{ fontFamily: ff.b, fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.7 }}>
            Whether you&apos;re a producer seeking US market entry or a buyer looking for exceptional products, we&apos;d love to hear from you.
          </p>
          <Link href="/contact" style={{
            fontFamily: ff.b, fontSize: "11px", letterSpacing: "4px", color: T.paper, background: T.wine,
            padding: "18px 44px", display: "inline-block", textTransform: "uppercase", fontWeight: 600
          }}>
            Get in Touch
          </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
