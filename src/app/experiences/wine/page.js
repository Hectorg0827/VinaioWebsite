"use client";

import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export default function WorldOfWinesPage() {
  return (
    <main style={{ background: T.bg, minHeight: "100vh" }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ 
        height: "80vh", 
        position: "relative", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        overflow: "hidden"
      }}>
        <img 
          src="/images/experiences/wine_experience.png" 
          alt="World of Wines" 
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} 
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
        
        <div style={{ position: "relative", textAlign: "center", padding: "0 20px", zIndex: 10 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
              <Hr w="40px" c={T.paper} />
              <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.paper }}>
                Editorial Experience
              </span>
              <Hr w="40px" c={T.paper} />
            </div>
            <h1 style={{ 
              fontFamily: ff.h, 
              fontSize: "clamp(48px, 8vw, 100px)", 
              color: T.paper, 
              lineHeight: 1, 
              marginBottom: "32px",
              fontWeight: 400
            }}>
              World of Wines
            </h1>
            <p style={{ 
              fontFamily: ff.b, 
              fontSize: "18px", 
              color: "rgba(255,255,255,0.9)", 
              maxWidth: "700px", 
              margin: "0 auto", 
              lineHeight: 1.6,
              letterSpacing: "1px"
            }}>
              Explore the stories, regions, grapes, and craftsmanship behind the wines Vinaio brings to market.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 56px", background: T.paper }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Hr w="32px" c={T.wine} style={{ margin: "0 auto 32px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.ink, marginBottom: "32px" }}>
              Education first. Inspiration second.
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, lineHeight: 1.8, marginBottom: "48px" }}>
              At Vinaio, we believe that understanding wine is the key to enjoying it. Whether you are a seasoned sommelier or a curious enthusiast, our digital gallery is designed to provide you with the knowledge and stories that make every bottle unique.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Learning Grid ───────────────────────────────────────────────── */}
      <section style={{ padding: "100px 56px", background: T.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px" }}>
            {[
              {
                title: "Terroir & Regions",
                desc: "From the sun-drenched hills of Spain to the volcanic soils of Italy, discover how land shapes flavor.",
                icon: "🌍"
              },
              {
                title: "The Art of Winemaking",
                desc: "Explore the balance of tradition and innovation in modern viticulture and cellar techniques.",
                icon: "🍇"
              },
              {
                title: "Pairing Studio",
                desc: "Master the fundamental science of food and wine synergy to elevate every dining experience.",
                icon: "🍽️"
              }
            ].map((topic, i) => (
              <Reveal key={topic.title} delay={i * 0.1}>
                <div style={{ 
                  background: T.paper, 
                  padding: "48px", 
                  borderRadius: "16px", 
                  border: `1px solid ${T.cream}`,
                  height: "100%",
                  transition: "all 0.4s",
                  cursor: "default"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.wine}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.cream}
                >
                  <div style={{ fontSize: "32px", marginBottom: "24px" }}>{topic.icon}</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "16px" }}>{topic.title}</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, lineHeight: 1.6 }}>{topic.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Producer Stories CTA ────────────────────────────────────────── */}
      <section style={{ padding: "140px 56px", textAlign: "center", background: T.paper }}>
        <Reveal>
          <h2 style={{ fontFamily: ff.h, fontSize: "48px", color: T.ink, marginBottom: "40px" }}>Learn from the Pioneers</h2>
          <Link 
            href="/portfolio"
            style={{ 
              display: "inline-block", 
              fontFamily: ff.b, 
              fontSize: "11px", 
              letterSpacing: "4px", 
              textTransform: "uppercase", 
              color: T.paper, 
              background: T.wine, 
              padding: "20px 48px",
              borderRadius: "4px",
              transition: "all 0.3s"
            }}
          >
            Explore our Producers
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
