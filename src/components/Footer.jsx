"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, ff } from "@/lib/theme";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch("/api/admin/config?key=branding");
        const data = await res.json();
        if (data.config?.value?.logo_url) {
          setLogoUrl(data.config.value.logo_url);
        }
      } catch (err) {
        console.error("Footer branding fetch error:", err);
      }
    };
    fetchBranding();
  }, []);

  if (isAdmin) return null;

  return (
    <footer
      style={{
        background: T.wine,
        padding: "60px 48px",
        borderTop: `1px solid rgba(255,255,255,0.1)`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        {/* Brand */}
        <div style={{ minWidth: "200px" }}>
          <img
            src={logoUrl}
            alt="Vinaio Imports"
            style={{
              height: "40px",
              width: "auto",
              filter: "brightness(0) invert(1)",
              marginBottom: "20px",
            }}
          />
          <p
            style={{
              fontFamily: ff.b,
              fontSize: "12px",
              color: T.warm,
              lineHeight: 1.6,
              maxWidth: "240px",
            }}
          >
            Vinaio Imports, Ltd. is a full-service beverage alcohol importer 
            and distributor. Bridge between terroir and market.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
          <div>
            <h4 style={{ fontFamily: ff.h, fontSize: "14px", color: T.paper, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>Explore</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["/",          "Home"],
                ["/portfolio", "Portfolio"],
                ["/about",     "About Us"],
                ["/services",  "Services"],
                ["/contact",   "Contact"],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontFamily: ff.b, fontSize: "12px", color: T.warm, textDecoration: "none" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: ff.h, fontSize: "14px", color: T.paper, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["/privacy", "Privacy Policy"],
                ["/terms",   "Terms of Service"],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontFamily: ff.b, fontSize: "12px", color: T.warm, textDecoration: "none" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "48px auto 0",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <p style={{ fontFamily: ff.b, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} Vinaio Imports, Ltd. All rights reserved.{" "}
          <Link href="/admin" style={{ color: "rgba(255,255,255,0.1)", textDecoration: "none", cursor: "default" }}>·</Link>
        </p>
        <p style={{ fontFamily: ff.b, fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", textTransform: "uppercase" }}>
          Please Drink Responsibly
        </p>
      </div>
    </footer>
  );
}
