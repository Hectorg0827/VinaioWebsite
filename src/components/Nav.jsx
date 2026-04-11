"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, ff } from "@/lib/theme";

const LINKS = [
  { href: "/",          label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { 
    href: "#", 
    label: "Experiences",
    items: [
      { href: "/experiences/wine", label: "World of Wines" },
      { href: "/experiences/rum",  label: "House of Rum" }
    ]
  },
  { href: "/about",     label: "About Us" },
  { href: "/services",  label: "Services" },
  { href: "/contact",   label: "Contact" },
];

export default function Nav() {
  const pathname    = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [logoUrl, setLogoUrl]     = useState("/logo.png");

  const isPortal = pathname.startsWith("/portal");
  const isAdmin  = pathname.startsWith("/admin");
  const isHome      = pathname === "/";
  const isPortfolio = pathname === "/portfolio";
  const isAbout     = pathname === "/about";

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch("/api/admin/config?key=branding");
        const data = await res.json();
        if (data.config?.value?.logo_url) {
          setLogoUrl(data.config.value.logo_url);
        }
      } catch (err) {
        console.error("Nav branding fetch error:", err);
      }
    };
    fetchBranding();

    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (isAdmin) return null; // Admin has its own top bar

  const isDarkHero = (isHome || isPortfolio || isAbout) && !scrolled;
  const dark = isDarkHero || isPortal;

  const bgColor = isPortal
    ? T.ink
    : menuOpen
    ? T.bg
    : "rgba(248,246,243,0.96)";

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        .nav-link { color: ${dark ? "rgba(255,255,255,0.5)" : T.muted}; transition: all 0.3s; }
        .nav-link:hover { color: ${T.wine} !important; }
        .square-tile {
          width: 50px; height: 50px; background: ${T.bg}; border: 1px solid ${T.cream};
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none; cursor: pointer; position: relative; overflow: hidden;
        }
        .square-tile:hover { background: ${T.wine}; border-color: ${T.wine}; color: ${T.paper} !important; }
        .square-tile span {
          font-family: ${ff.b}; font-size: 8px; letter-spacing: 1px; text-transform: uppercase;
          font-weight: 600; text-align: center; color: inherit;
        }
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
          backdropFilter: isPortal || menuOpen ? "none" : "blur(24px) saturate(1.6)",
          borderBottom: isPortal && !menuOpen ? "none" : `1px solid ${T.cream}`,
          transform: scrolled && !menuOpen ? "translateY(-100%)" : "translateY(0%)",
          transition: "background 0.4s, border 0.4s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
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
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img 
              src={logoUrl} 
              alt="Vinaio Imports" 
              style={{ 
                height: scrolled ? "32px" : "40px",
                width: "auto",
                filter: "none",
                transition: "height 0.4s",
              }} 
            />
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ gap: "28px", alignItems: "center" }}>
            {LINKS.map(({ href, label, items }) => {
              const active = pathname === href || (items && items.some(item => pathname === item.href));
              const hasSub = !!items;

              return (
                <div 
                  key={label}
                  className="nav-item-container"
                  onMouseEnter={() => hasSub && setActiveDropdown(label)}
                  onMouseLeave={() => hasSub && setActiveDropdown(null)}
                  style={{ position: "relative" }}
                >
                  <Link href={href} className="nav-link" style={{
                    fontFamily: ff.b,
                    fontSize: "10px",
                    fontWeight: active ? 600 : 400,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: active ? (isPortal ? T.paper : T.wine) : (isPortal ? "rgba(255,255,255,0.5)" : T.muted),
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    {label}
                    {hasSub && (
                      <span style={{ fontSize: "8px", transform: activeDropdown === label ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▼</span>
                    )}
                  </Link>

                  {hasSub && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: activeDropdown === label ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(10px)",
                      opacity: activeDropdown === label ? 1 : 0,
                      visibility: activeDropdown === label ? "visible" : "hidden",
                      background: "rgba(255,255,255,0.98)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${T.cream}`,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      padding: "16px",
                      minWidth: "200px",
                      transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                      zIndex: 1000,
                      marginTop: "20px"
                    }}>
                      {items.map(sub => (
                        <Link 
                          key={sub.href} 
                          href={sub.href}
                          style={{
                            display: "block",
                            padding: "12px 16px",
                            fontFamily: ff.b,
                            fontSize: "10px",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            color: pathname === sub.href ? T.wine : T.muted,
                            transition: "all 0.3s",
                            whiteSpace: "nowrap"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = T.wine}
                          onMouseLeave={(e) => e.currentTarget.style.color = (pathname === sub.href ? T.wine : T.muted)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
              background: isPortal ? T.wine : "transparent",
              border: `1px solid ${isPortal ? T.wine : T.taupe}`,
              color: isPortal ? T.paper : T.wine,
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
          transition: "max-height 0.35s ease, visibility 0.35s",
          background: T.bg,
          borderTop: menuOpen ? `1px solid ${T.cream}` : "none",
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
        }}>
          <nav style={{
            display: "flex",
            flexDirection: "column",
            padding: "16px 32px 28px",
            gap: "0",
          }}>
            {LINKS.map(({ href, label, items }) => {
              const active = pathname === href || (items && items.some(item => pathname === item.href));
              const hasSub = !!items;

              return (
                <div key={label} style={{ borderBottom: `1px solid ${T.cream}` }}>
                  <div 
                    onClick={() => hasSub && setActiveDropdown(activeDropdown === label ? null : label)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 0",
                      cursor: "pointer"
                    }}
                  >
                    <Link href={hasSub ? "#" : href} style={{
                      fontFamily: ff.b,
                      fontSize: "13px",
                      fontWeight: active ? 600 : 400,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      color: active ? T.wine : T.deep,
                      flexGrow: 1
                    }}>
                      {label}
                    </Link>
                    {hasSub && (
                      <span style={{ fontSize: "10px", color: T.muted }}>
                        {activeDropdown === label ? "−" : "+"}
                      </span>
                    )}
                  </div>
                  
                  {hasSub && (
                    <div style={{
                      maxHeight: activeDropdown === label ? "200px" : "0",
                      overflow: "hidden",
                      transition: "all 0.4s ease",
                      paddingLeft: "20px"
                    }}>
                      {items.map(sub => (
                        <Link key={sub.href} href={sub.href} style={{
                          display: "block",
                          padding: "12px 0",
                          fontFamily: ff.b,
                          fontSize: "11px",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          color: pathname === sub.href ? T.wine : T.muted,
                        }}>
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
      {/* ── Squares Navigation (Ensured safe removal) ── */}

    </>
  );
}
