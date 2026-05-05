"use client";

import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export default function PortalWelcome() {
  return (
    <section style={{
      minHeight: "100vh",
      background: T.ink,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "120px 48px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Ambience */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        background: `radial-gradient(circle at 50% 50%, ${T.wineDeep}40 0%, transparent 60%)`,
        opacity: 0.8
      }} />
      
      <div style={{ position: "relative", width: "100%", maxWidth: "800px", textAlign: "center" }}>
        <Reveal>
          <div style={{ marginBottom: "64px" }}>
            <img 
              src="/logo.png" 
              alt="Vinaio Logo" 
              style={{ width: "120px", height: "auto", margin: "0 auto", filter: "brightness(2)" }} 
            />
          </div>
          
          <Hr w="40px" c={T.gold} style={{ margin: "0 auto 32px" }} />
          
          <h1 style={{ 
            fontFamily: ff.h, 
            fontSize: "clamp(36px, 6vw, 64px)", 
            color: T.paper, 
            marginBottom: "24px",
            lineHeight: 1.1
          }}>
            Vinaio Trade Partner Portal
          </h1>
          
          <p style={{ 
            fontFamily: ff.b, 
            fontSize: "16px", 
            color: T.warm, 
            maxWidth: "500px", 
            margin: "0 auto 64px",
            lineHeight: 1.8,
            letterSpacing: "0.5px"
          }}>
            Exclusive access for licensed wholesale partners. Manage your inventory, 
            view allocations, and track invoices with Vinaio's digital partner experience.
          </p>
        </Reveal>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px",
          marginTop: "48px"
        }}>
          <Reveal delay={0.2}>
            <Link 
              href="/portal/login"
              style={{
                display: "block",
                padding: "48px 32px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                textDecoration: "none",
                textAlign: "left",
                transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "16px" }}>🔑</div>
              <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "12px" }}>Sign In</h3>
              <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.6 }}>
                Access your existing account to manage orders and invoices.
              </p>
              <div style={{ marginTop: "24px", color: T.gold, fontSize: "10px", fontFamily: ff.b, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>
                Enter Portal →
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.3}>
            <Link 
              href="/portal/register"
              style={{
                display: "block",
                padding: "48px 32px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                textDecoration: "none",
                textAlign: "left",
                transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = T.wine;
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "16px" }}>🍷</div>
              <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "12px" }}>New Accounts</h3>
              <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.6 }}>
                Licensed trade partners can request new portal credentials here.
              </p>
              <div style={{ marginTop: "24px", color: T.wine, fontSize: "10px", fontFamily: ff.b, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>
                Request Access →
              </div>
            </Link>
          </Reveal>
        </div>
        
        <Reveal delay={0.5}>
          <div style={{ marginTop: "80px", opacity: 0.4 }}>
            <Link href="/" style={{ 
              fontFamily: ff.b, 
              fontSize: "10px", 
              color: T.paper, 
              textDecoration: "none", 
              textTransform: "uppercase", 
              letterSpacing: "3px" 
            }}>
              ← Return to Vinaio Public Website
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
