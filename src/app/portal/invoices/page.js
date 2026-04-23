"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";
import PortalShell from "@/components/PortalShell";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("due_date", { ascending: false });

    if (data) setInvoices(data);
    setLoading(false);
  };

  const fmt = (n) => `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <PortalShell title="Invoices & Payments">
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Invoices & Payments</h1>
        <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>View outstanding balances and pay online via QuickBooks.</p>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: `1px solid ${T.cream}`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1.5fr", padding: "16px 24px", background: T.bg, borderBottom: `1px solid ${T.cream}`, fontFamily: ff.b, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, color: T.muted }}>
          <span>Invoice # / Date</span>
          <span>Due Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>Payment Action</span>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: T.muted }}>Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: T.muted }}>No invoices found.</div>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1.5fr", padding: "20px 24px", borderBottom: `1px solid ${T.cream}`, alignItems: "center" }}>
              <div>
                <span style={{ display: "block", fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.ink }}>{inv.invoice_number}</span>
                <span style={{ fontSize: "11px", color: T.muted }}>{new Date(inv.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize: "13px", color: T.ink }}>
                {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}
              </div>
              <div>
                <span style={{ display: "block", fontFamily: ff.b, fontSize: "15px", fontWeight: 700, color: T.ink }}>{fmt(inv.amount)}</span>
                {inv.balance > 0 && inv.balance < inv.amount && (
                  <span style={{ fontSize: "11px", color: T.muted }}>Balance: {fmt(inv.balance)}</span>
                )}
              </div>
              <div>
                <StatusBadge status={inv.status} balance={inv.balance} />
              </div>
              <div style={{ textAlign: "right" }}>
                {inv.balance > 0 && inv.payment_url ? (
                  <a 
                    href={inv.payment_url} 
                    target="_blank"
                    style={{ 
                      padding: "10px 20px", background: T.wine, color: "white", 
                      textDecoration: "none", borderRadius: "6px", fontSize: "11px", 
                      fontWeight: 700, letterSpacing: "1px", display: "inline-block" 
                    }}
                  >
                    PAY ONLINE
                  </a>
                ) : inv.balance > 0 ? (
                  <span style={{ fontSize: "11px", color: T.muted }}>Contact office for payment</span>
                ) : (
                  <span style={{ color: T.green, fontSize: "11px", fontWeight: 700 }}>PAID √</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </PortalShell>
  );
}

function StatusBadge({ status, balance }) {
  const isPaid = status === "paid" || balance === 0;
  const isOverdue = status === "overdue";
  const isPartial = status === "partially_paid" || (balance > 0 && balance < 100); // simplistic

  let bg = `${T.gold}15`, text = T.gold;
  if (isPaid) { bg = `${T.green}15`; text = T.green; }
  if (isOverdue) { bg = `${T.red}15`; text = T.red; }

  return (
    <span style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", background: bg, color: text, border: `1px solid ${text}30` }}>
      {isPaid ? "PAID" : isOverdue ? "OVERDUE" : status || "OPEN"}
    </span>
  );
}
