"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";

export default function AdminCustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setCustomers(data);
    if (error) setMsg({ type: "error", text: error.message });
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setMsg({ type: "success", text: `Updating status to ${status}...` });
    
    // We use a dedicated API for this to ensure it's done via service role if RLS is tight
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setMsg({ type: "success", text: `Account successfully ${status === 'active' ? 'activated' : 'updated'}.` });
      fetchCustomers();
    } else {
      const err = await res.json();
      setMsg({ type: "error", text: err.error || "Failed to update." });
    }
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "40px" }}>
        <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
        <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Trade Partners</h1>
        <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>Review and approve portal registrations.</p>
      </div>

      {msg && (
        <div style={{ padding: "16px", borderRadius: "8px", background: msg.type === "success" ? `${T.green}15` : `${T.red}15`, color: msg.type === "success" ? T.green : T.red, marginBottom: "24px", fontSize: "13px" }}>
          {msg.text}
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", border: `1px solid ${T.cream}`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.5fr", padding: "16px 24px", background: T.bg, borderBottom: `1px solid ${T.cream}`, fontFamily: ff.b, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, color: T.muted }}>
          <span>Company / Contact</span>
          <span>Details</span>
          <span>Status</span>
          <span>Joined</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: T.muted }}>Loading partners...</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: T.muted }}>No trade partners found.</div>
        ) : (
          customers.map((c) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.5fr", padding: "20px 24px", borderBottom: `1px solid ${T.cream}`, alignItems: "center" }}>
              <div>
                <span style={{ display: "block", fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink }}>{c.company || "Unnamed Company"}</span>
                <span style={{ fontSize: "12px", color: T.muted }}>{c.rep_name || "No primary contact"}</span>
              </div>
              <div style={{ fontSize: "12px", color: T.muted }}>
                <div>ID: {c.account_number || "—"}</div>
                <div>Terms: {c.credit_terms}</div>
              </div>
              <div>
                <span style={{ 
                  padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
                  background: c.status === 'active' ? `${T.green}15` : c.status === 'pending' ? `${T.gold}15` : `${T.red}15`,
                  color: c.status === 'active' ? T.green : c.status === 'pending' ? T.gold : T.red
                }}>
                  {c.status || "active"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: T.muted }}>
                {new Date(c.created_at).toLocaleDateString()}
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                {c.status === "pending" && (
                  <button 
                    onClick={() => updateStatus(c.id, "active")}
                    style={{ padding: "8px 16px", background: T.wine, color: "white", border: "none", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                  >
                    Approve
                  </button>
                )}
                <button 
                  onClick={() => updateStatus(c.id, c.status === 'suspended' ? 'active' : 'suspended')}
                  style={{ padding: "8px 16px", background: "transparent", color: T.ink, border: `1px solid ${T.cream}`, borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                >
                  {c.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
