"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

const LINKS = [
  { href: "/",          label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/spain",     label: "Spain & Europe" },
  { href: "/services",  label: "Services" },
  { href: "/contact",   label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isPortal = pathname.startsWith("/portal");
  const isHome   = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const hero = isHome && !scrolled;
  const dark = hero || isPortal;

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 900,
        padding: scrolled ? "14px 48px" : "24px 48px",
        background: isPortal
          ? T.ink
          : hero
          ? "transparent"
          : "rgba(248,246,243,0.9)",
        backdropFilter: dark ? "none" : "blur(24px) saturate(1.6)",
        borderBottom: dark ? "none" : `1px solid ${T.cream}`,
        transition: "all 0.4s",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Wordmark */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <span
          style={{
            fontFamily: ff.h,
            fontSize: "22px",
            fontWeight: 500,
            color: dark ? T.paper : T.ink,
            letterSpacing: "6px",
            textTransform: "uppercase",
            transition: "color 0.4s",
          }}
        >
          Vinaio
        </span>
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
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
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* Portal button */}
        <Link
          href="/portal"
          style={{
            fontFamily: ff.b,
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 600,
            textDecoration: "none",
            padding: "8px 18px",
            borderRadius: "4px",
            background: isPortal ? T.wine : "transparent",
            border: `1px solid ${
              isPortal ? T.wine : dark ? "rgba(255,255,255,0.25)" : T.taupe
            }`,
            color: isPortal ? T.paper : dark ? T.paper : T.wine,
            transition: "all 0.3s",
          }}
        >
          Customer Portal
        </Link>
      </nav>
    </header>
  );
}
