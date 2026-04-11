"use client";

import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export default function HouseOfRumPage() {
  return (
    <main style={{ background: T.ink, minHeight: "100vh", color: T.paper }}>
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
          src="/images/experiences/rum_experience.png" 
          alt="Vinaio House of Rum" 
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} 
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 0%, ${T.ink} 100%)` }} />
        
        <div style={{ position: "relative", textAlign: "center", padding: "0 20px", zIndex: 10 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
              <Hr w="40px" c={T.gold} />
              <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold }}>
                Heritage & Craft
              </span>
              <Hr w="40px" c={T.gold} />
            </div>
            <h1 style={{ 
              fontFamily: ff.h, 
              fontSize: "clamp(48px, 8vw, 100px)", 
              color: T.paper, 
              lineHeight: 1, 
              marginBottom: "32px",
              fontWeight: 400
            }}>
              Vinaio House of Rum
            </h1>
            <p style={{ 
              fontFamily: ff.b, 
              fontSize: "18px", 
              color: "rgba(255,255,255,0.7)", 
              maxWidth: "700px", 
              margin: "0 auto", 
              lineHeight: 1.6,
              letterSpacing: "1px"
            }}>
              Step into the world of rum — its origins, craft, aging traditions, and the spirits shaping unforgettable experiences.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 56px", background: T.ink }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Hr w="32px" c={T.gold} style={{ margin: "0 auto 32px" }} />
            <h2 style={{ fontFamily: ff.h, fontSize: "42px", color: T.paper, marginBottom: "32px" }}>
              The Soul of the Caribbean
            </h2>
            <p style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "48px" }}>
              Rum is more than just a spirit—it is a cultural legacy born from the sugarcane fields and perfected in the shadows of the barrel room. At Vinaio&apos;s House of Rum, we celebrate the ritual of aging, the science of distillation, and the artistry of the blend.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Educational Blocks ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 56px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
            {[
              {
                title: "Aging Traditions",
                desc: "Explore the different methods of maturation, from tropical aging to the complex Solera systems of the Caribbean.",
                img: "https://images.unsplash.com/photo-1584226761916-3fd67ab5ac3a?auto=format&fit=crop&q=80&w=1000"
              },
              {
                title: "Cocktail Studio",
                desc: "Discover the chemistry of classic rum serves, from the timeless Daiquiri to modern heritage-driven cocktails.",
                img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000"
              }
            ].map((block, i) => (
              <Reveal key={block.title} delay={i * 0.1}>
                <div style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  borderRadius: "20px", 
                  overflow: "hidden", 
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.4s"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                >
                  <div style={{ height: "240px", overflow: "hidden" }}>
                    <img src={block.img} alt={block.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
                  </div>
                  <div style={{ padding: "40px" }}>
                    <h3 style={{ fontFamily: ff.h, fontSize: "28px", color: T.gold, marginBottom: "16px" }}>{block.title}</h3>
                    <p style={{ fontFamily: ff.b, fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{block.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Showcase ─────────────────────────────────────────── */}
      <section style={{ padding: "140px 56px", textAlign: "center", background: T.ink }}>
        <Reveal>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 32px" }} />
          <h2 style={{ fontFamily: ff.h, fontSize: "48px", color: T.paper, marginBottom: "24px" }}>Experience the Mastery</h2>
          <p style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", margin: "0 auto 48px", lineHeight: 1.6 }}>
            Browse our portfolio of award-winning Dominican and global rums.
          </p>
          <Link 
            href="/portfolio"
            style={{ 
              display: "inline-block", 
              fontFamily: ff.b, 
              fontSize: "11px", 
              letterSpacing: "4px", 
              textTransform: "uppercase", 
              color: T.ink, 
              background: T.gold, 
              padding: "20px 48px",
              borderRadius: "4px",
              transition: "all 0.3s",
              fontWeight: 600
            }}
          >
            Explore Rum Brands
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
