"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, ff } from "@/lib/theme";

const LINKS = [
  { href: "/",          label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/spain",     label: "Spain & Europe" },
  { href: "/services",  label: "Services" },
  { href: "/contact",   label: "Contact" },
];

export default function Nav() {
  const pathname    = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  const isPortal = pathname.startsWith("/portal");
  const isAdmin  = pathname.startsWith("/admin");
  const isHome   = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (isAdmin) return null; // Admin has its own top bar

  const hero = isHome && !scrolled;
  const dark = hero || isPortal;

  const bgColor = isPortal
    ? T.ink
    : hero
    ? "transparent"
    : menuOpen
    ? T.bg
    : "rgba(248,246,243,0.92)";

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 900,
          background: bgColor,
          backdropFilter: dark || menuOpen ? "none" : "blur(24px) saturate(1.6)",
          borderBottom: dark && !menuOpen ? "none" : `1px solid ${T.cream}`,
          transition: "background 0.4s, border 0.4s",
        }}
      >
        {/* ── Main bar ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: scrolled ? "14px 48px" : "24px 48px",
          transition: "padding 0.4s",
        }}>
          {/* Wordmark */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: ff.h,
              fontSize: "22px",
              fontWeight: 500,
              color: dark || menuOpen ? (menuOpen && !isPortal ? T.ink : T.paper) : T.ink,
              letterSpacing: "6px",
              textTransform: "uppercase",
              transition: "color 0.4s",
            }}>
              Vinaio
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ gap: "28px", alignItems: "center" }}>
            {LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{
                  fontFamily: ff.b,
                  fontSize: "10px",
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: active
                    ? dark ? T.paper : T.wine
                    : dark ? "rgba(255,255,255,0.5)" : T.muted,
                  transition: "color 0.3s",
                }}>
                  {label}
                </Link>
              );
            })}
            <Link href="/portal" style={{
              fontFamily: ff.b,
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              textDecoration: "none",
              padding: "8px 18px",
              borderRadius: "4px",
              background: isPortal ? T.wine : "transparent",
              border: `1px solid ${isPortal ? T.wine : dark ? "rgba(255,255,255,0.25)" : T.taupe}`,
              color: isPortal ? T.paper : dark ? T.paper : T.wine,
              transition: "all 0.3s",
            }}>
              Customer Portal
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block",
                width: "22px",
                height: "2px",
                background: dark && !menuOpen ? T.paper : T.ink,
                borderRadius: "2px",
                transition: "all 0.3s",
                transform:
                  menuOpen && i === 0 ? "translateY(7px) rotate(45deg)" :
                  menuOpen && i === 1 ? "scaleX(0)" :
                  menuOpen && i === 2 ? "translateY(-7px) rotate(-45deg)" : "none",
              }} />
            ))}
          </button>
        </div>

        {/* ── Mobile dropdown menu ── */}
        <div style={{
          maxHeight: menuOpen ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
          background: T.bg,
          borderTop: menuOpen ? `1px solid ${T.cream}` : "none",
        }}>
          <nav style={{
            display: "flex",
            flexDirection: "column",
            padding: "16px 32px 28px",
            gap: "0",
          }}>
            {LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{
                  fontFamily: ff.b,
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: active ? T.wine : T.deep,
                  padding: "14px 0",
                  borderBottom: `1px solid ${T.cream}`,
                }}>
                  {label}
                </Link>
              );
            })}
            <Link href="/portal" style={{
              fontFamily: ff.b,
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              textDecoration: "none",
              color: T.paper,
              background: T.wine,
              padding: "14px 20px",
              borderRadius: "6px",
              textAlign: "center",
              marginTop: "16px",
            }}>
              Customer Portal
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
