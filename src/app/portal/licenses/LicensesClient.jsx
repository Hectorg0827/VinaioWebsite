"use client";

import { T, ff } from "@/lib/theme";
import Badge from "@/components/Badge";

const MOCK_LICENSES = [
  { id: "1", type: "State Liquor License",    state: "New York",    number: "NY-LIQ-2024-88412", expiry: "2026-08-15", status: "active"   },
  { id: "2", type: "State Liquor License",    state: "New Jersey",  number: "NJ-LIQ-2024-33201", expiry: "2026-05-01", status: "expiring" },
  { id: "3", type: "Federal Basic Permit",    state: "Federal",     number: "TTB-BP-2024-01234", expiry: "2027-01-30", status: "active"   },
  { id: "4", type: "Distribution Agreement",  state: "NY/NJ",       number: "DA-VIN-2025-001",   expiry: "2026-12-31", status: "active"   },
  { id: "5", type: "Exclusive Import Contract",state: "Caribbean",  number: "EIC-VIN-2025-042",  expiry: "2026-04-15", status: "expiring" },
];

export default function LicensesClient({ licenses }) {
  const data = licenses.length ? licenses : MOCK_LICENSES;

  const daysUntil = (d) =>
    Math.round((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>
        Licenses &amp; Contracts
      </h2>
      <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, marginBottom: "32px" }}>
        Monitor expirations and keep compliance documents current
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((lic) => {
          const days = daysUntil(lic.expiry);
          return (
            <div
              key={lic.id}
              style={{
                padding: "24px",
                background: T.paper,
                border: `1px solid ${lic.status === "expiring" ? T.orange + "40" : T.cream}`,
                borderRadius: "8px",
                borderLeft: `4px solid ${lic.status === "expiring" ? T.orange : lic.status === "active" ? T.green : T.red}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h4 style={{ fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink, marginBottom: "4px" }}>{lic.type}</h4>
                  <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted }}>{lic.number} · {lic.state}</p>
                </div>
                <Badge status={lic.status} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted }}>Expires: </span>
                  <span style={{ fontFamily: ff.b, fontSize: "12px", color: days < 60 ? T.orange : T.muted, fontWeight: days < 60 ? 600 : 400 }}>
                    {lic.expiry} ({days} days)
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ fontFamily: ff.b, fontSize: "11px", color: T.blue, fontWeight: 600, cursor: "pointer" }}>View Document</span>
                  {lic.status === "expiring" && (
                    <span style={{ fontFamily: ff.b, fontSize: "11px", color: T.orange, fontWeight: 600, cursor: "pointer" }}>Renew Now</span>
                  )}
                  <span style={{ fontFamily: ff.b, fontSize: "11px", color: T.wine, fontWeight: 600, cursor: "pointer" }}>Upload Update</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {licenses.length === 0 && (
        <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, textAlign: "center", marginTop: "16px" }}>
          Showing sample data — connect your account to see real licenses.
        </p>
      )}
    </>
  );
}
