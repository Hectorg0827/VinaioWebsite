"use client";

import { T, ff } from "@/lib/theme";

const fmt = (n) =>
  typeof n === "number" ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : n ?? "—";

export default function AccountClient({ customer, user }) {
  const co = customer ?? {};

  return (
    <>
      <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "32px" }}>Account Details</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Company info */}
        <div style={{ padding: "32px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
          <h3 style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>
            Company Information
          </h3>
          {[
            ["Company",  co.company  ?? "—"],
            ["Email",    user.email  ?? "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: "18px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginBottom: "4px" }}>{k}</p>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.ink }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Account & credit */}
        <div style={{ padding: "32px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
          <h3 style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>
            Account &amp; Credit
          </h3>
          {[
            ["Account Number", co.account_number ?? "—"],
            ["Credit Terms",   co.credit_terms   ?? "Net 30"],
            ["Credit Limit",   fmt(co.credit_limit)],
            ["Current Balance",fmt(co.balance)],
            ["Sales Rep",      co.rep_name        ?? "—"],
            ["Rep Phone",      co.rep_phone       ?? "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: "14px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginBottom: "4px" }}>{k}</p>
              <p style={{
                fontFamily: ff.b,
                fontSize: "14px",
                color: k === "Current Balance" ? T.wine : T.ink,
                fontWeight: k === "Current Balance" ? 600 : 400,
              }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div style={{ marginTop: "24px", padding: "24px 32px", background: T.cream, borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 500, color: T.ink }}>Password & Security</p>
          <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted }}>Update your account password</p>
        </div>
        <a href="/portal/login" style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: T.wine, fontWeight: 600 }}>
          Reset Password →
        </a>
      </div>
    </>
  );
}
