"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, ff } from "@/lib/theme";

export default function PortalShell({ children, title }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/portal", icon: "🏠" },
    { label: "Invoices & Payments", href: "/portal/invoices", icon: "🧾" },
    { label: "Sales History", href: "/portal/history", icon: "🍷" },
    { label: "Place Order", href: "/portal/orders", icon: "🛒" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: T.ink, color: T.paper, padding: "40px 0", display: "flex", flexDirection: "column", borderRight: `1px solid ${T.white}10`, position: "fixed", top: 0, bottom: 0 }}>
        <div style={{ padding: "0 24px 40px", textAlign: "center" }}>
          <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.gold, margin: 0 }}>VINAIO</h2>
          <p style={{ fontSize: "9px", letterSpacing: "2px", color: T.warm, margin: "4px 0 0", textTransform: "uppercase" }}>Customer Portal</p>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 24px",
                  textDecoration: "none",
                  color: active ? T.gold : T.warm,
                  background: active ? "rgba(255,255,255,0.05)" : "transparent",
                  fontFamily: ff.b,
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  borderLeft: `3px solid ${active ? T.gold : "transparent"}`,
                  transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "24px", borderTop: `1px solid ${T.white}05` }}>
            <Link href="/" style={{ fontSize: "11px", color: T.warm, textDecoration: "none", opacity: 0.7 }}>← Back to Website</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: "260px", padding: "60px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
