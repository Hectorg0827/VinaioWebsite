"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/portal",            icon: "◉", label: "Dashboard" },
  { href: "/portal/orders",     icon: "＋", label: "New Order" },
  { href: "/portal/invoices",   icon: "◈", label: "Invoices" },
  { href: "/portal/history",    icon: "◷", label: "Order History" },
  { href: "/portal/reorder",    icon: "↻", label: "Quick Reorder" },
  { href: "/portal/ai-advisor", icon: "✦", label: "AI Sales Advisor" },
  { href: "/portal/account",    icon: "◎", label: "Account" },
  { href: "/portal/licenses",   icon: "◆", label: "Licenses & Contracts" },
];

export default function PortalShell({ children, user }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const isLogin   = pathname === "/portal/login";

  if (isLogin) return <>{children}</>;

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  const displayName = user?.email?.split("@")[0] ?? "User";

  return (
    <section style={{ minHeight: "100vh", background: T.bg, paddingTop: "80px", display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          background: T.silk,
          padding: "32px 0",
          position: "fixed",
          top: "80px",
          bottom: 0,
          left: 0,
          overflowY: "auto",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${T.cream}`
        }}
      >
        <div style={{ padding: "0 24px 24px", borderBottom: `1px solid ${T.cream}`, flexShrink: 0 }}>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.ink, fontWeight: 500 }}>{displayName}</p>
          <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted, marginTop: "2px" }}>{user?.email}</p>
        </div>

        <nav style={{ padding: "16px 0", flex: 1 }}>
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "12px 24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: active ? T.paper : "transparent",
                  borderLeft: active ? `3px solid ${T.wine}` : "3px solid transparent",
                  transition: "all 0.25s",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "14px", color: active ? T.wine : T.muted, width: "20px", textAlign: "center" }}>{icon}</span>
                <span style={{ fontFamily: ff.b, fontSize: "12px", color: active ? T.ink : T.muted, fontWeight: active ? 500 : 400, transition: "color 0.25s" }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "20px 24px", borderTop: `1px solid ${T.cream}`, flexShrink: 0 }}>
          <button onClick={signOut} style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Sign Out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: "260px", padding: "40px 48px", minHeight: "calc(100vh - 80px)" }}>
        {children}
      </main>
    </section>
  );
}
