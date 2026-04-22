"use client";

import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Badge from "@/components/Badge";
import { createClient } from "@/lib/supabase/client";
import * as analytics from "@/lib/analytics";

export default function DashboardClient({ customer, invoices, orders, licenses, catalogs, user }) {
  const supabase = createClient();
  const displayName = customer?.company || user?.email?.split("@")[0] || "Customer";
  const firstName   = user?.email?.split("@")[0] ?? "there";

  const openInvoices  = invoices.filter((i) => i.status !== "paid");
  const overdueAmount = invoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + (i.amount - i.paid), 0);
  const expiringLic   = licenses.filter((l) => l.status === "expiring").length;
  const thisMonthOrds = orders.filter(
    (o) => new Date(o.created_at).getMonth() === new Date().getMonth()
  ).length;
  const creditAvail   = customer
    ? (customer.credit_limit - customer.balance).toFixed(2)
    : "—";

  const fmt = (n) =>
    typeof n === "number" ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : n;

  const logCatalogDownload = async (catalog) => {
    analytics.event({ 
      action: "catalog_download", 
      category: "portal", 
      label: catalog.name 
    });
    await supabase.from("portal_logs").insert([{
      customer_id: user.id,
      action: "download",
      details: { catalog_id: catalog.id, catalog_name: catalog.name }
    }]);
  };

  return (
    <>
      <h2 style={{ fontFamily: ff.h, fontSize: "36px", color: T.ink, marginBottom: "8px" }}>
        Welcome back, {firstName}
      </h2>
      <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, marginBottom: "40px" }}>
        {displayName}
        {customer?.account_number ? ` · ${customer.account_number}` : ""}
      </p>

      {/* ── Alert banners ── */}
      {overdueAmount > 0 && (
        <div style={{ padding: "16px 20px", background: T.redLight, border: `1px solid ${T.red}30`, borderRadius: "8px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: ff.b, fontSize: "13px", color: T.red }}>⚠ You have {fmt(overdueAmount)} in overdue invoices</span>
          <Link href="/portal/invoices" style={{ fontFamily: ff.b, fontSize: "11px", color: T.red, fontWeight: 600, textDecoration: "underline" }}>View Invoices</Link>
        </div>
      )}
      {expiringLic > 0 && (
        <div style={{ padding: "16px 20px", background: T.orangeLight, border: `1px solid ${T.orange}30`, borderRadius: "8px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: ff.b, fontSize: "13px", color: T.orange }}>📋 {expiringLic} license(s) expiring within 60 days</span>
          <Link href="/portal/licenses" style={{ fontFamily: ff.b, fontSize: "11px", color: T.orange, fontWeight: 600, textDecoration: "underline" }}>Review</Link>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "Open Balance",      value: customer ? fmt(customer.balance) : "—", color: T.wine },
          { label: "Open Invoices",     value: openInvoices.length,                    color: T.blue },
          { label: "Orders This Month", value: thisMonthOrds,                          color: T.green },
          { label: "Credit Available",  value: customer ? `$${Number(creditAvail).toLocaleString()}` : "—", color: T.gold },
        ].map((s) => (
          <div key={s.label} style={{ padding: "24px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
            <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontFamily: ff.h, fontSize: "28px", fontWeight: 500, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "Place New Order",   icon: "＋", href: "/portal/orders",     color: T.wine  },
          { label: "Quick Reorder",     icon: "↻",  href: "/portal/reorder",    color: T.green },
          { label: "AI Sales Advisor",  icon: "✦",  href: "/portal/ai-advisor", color: T.gold  },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            style={{
              padding: "28px 24px",
              background: T.paper,
              border: `1px solid ${T.cream}`,
              borderRadius: "8px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "border-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = a.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.cream)}
          >
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: `${a.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: a.color, flexShrink: 0 }}>{a.icon}</div>
            <span style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 500, color: T.ink }}>{a.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Recent orders ── */}
      <h3 style={{ fontFamily: ff.h, fontSize: "22px", color: T.ink, marginBottom: "16px" }}>Recent Orders</h3>
      {orders.length > 0 && (
        <div style={{ background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px", overflow: "hidden" }}>
          {orders.slice(0, 5).map((o, i) => (
            <div key={o.id} style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < Math.min(orders.length, 5) - 1 ? `1px solid ${T.cream}` : "none" }}>
              <div>
                <span style={{ fontFamily: ff.b, fontSize: "13px", fontWeight: 600, color: T.ink }}>
                  {o.id.slice(0, 8).toUpperCase()}
                </span>
                <span style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, marginLeft: "16px" }}>
                  {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {(o.order_items?.length ?? 0) > 0
                    ? ` · ${o.order_items.reduce((sum, item) => sum + (item.qty ?? 0), 0)} items`
                    : ""}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontFamily: ff.h, fontSize: "16px", color: T.ink }}>{fmt(o.total)}</span>
                <Badge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Catalogs ── */}
      <h3 style={{ fontFamily: ff.h, fontSize: "22px", color: T.ink, marginTop: "40px", marginBottom: "16px" }}>Latest Catalogs</h3>
      {catalogs.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {catalogs.map((c) => (
            <div key={c.id} style={{ background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.ink }}>{c.name}</p>
                <p style={{ fontSize: "11px", color: T.muted }}>{c.category_filter || "Full Portfolio"}</p>
              </div>
              <a 
                href={c.file_url} 
                target="_blank" 
                onClick={() => logCatalogDownload(c)}
                style={{ fontSize: "18px", textDecoration: "none" }}
              >
                📥
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "40px 24px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px", textAlign: "center" }}>
          <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>No catalogs available yet.</p>
        </div>
      )}
    </>
  );
}
