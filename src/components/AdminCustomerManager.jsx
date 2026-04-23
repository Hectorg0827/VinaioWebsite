"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";

export default function AdminCustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [activeView, setActiveView] = useState("customers"); // customers | requests
  const [onboardingRequest, setOnboardingRequest] = useState(null); // The request being converted
  const [showManualModal, setShowManualModal] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({ password: "", qbdId: "" });
  const [manualForm, setManualForm] = useState({ 
    company: "", 
    repName: "", 
    email: "", 
    licenseNumber: "", 
    qbdId: "", 
    password: "" 
  });
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [activeView]);

  const fetchData = async () => {
    setLoading(true);
    if (activeView === "customers") {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setCustomers(data);
      if (error) setMsg({ type: "error", text: error.message });
    } else {
      const { data, error } = await supabase
        .from("portal_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (data) setRequests(data);
      if (error) setMsg({ type: "error", text: error.message });
    }
    setLoading(false);
  };

  const startOnboarding = (req) => {
    setOnboardingRequest(req);
    const tempPass = Math.random().toString(36).slice(-8) + "!";
    setOnboardingForm({ password: tempPass, qbdId: "" });
  };

  const startManualOnboarding = () => {
    const tempPass = Math.random().toString(36).slice(-8) + "!";
    setManualForm({ company: "", repName: "", email: "", licenseNumber: "", qbdId: "", password: tempPass });
    setShowManualModal(true);
  };

  const submitOnboarding = async () => {
    if (!onboardingForm.qbdId) {
      setMsg({ type: "error", text: "QuickBooks ID is required to link accounts." });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/customers/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId: onboardingRequest.id,
        email: onboardingRequest.email,
        password: onboardingForm.password,
        company: onboardingRequest.company,
        repName: onboardingRequest.full_name,
        licenseNumber: onboardingRequest.license_number,
        qbdId: onboardingForm.qbdId
      })
    });

    if (res.ok) {
      setMsg({ type: "success", text: `Successfully onboarded ${onboardingRequest.company}!` });
      setOnboardingRequest(null);
      setActiveView("customers");
      fetchData();
    } else {
      const err = await res.json();
      setMsg({ type: "error", text: err.error || "Onboarding failed" });
    }
    setLoading(false);
  };

  const submitManualOnboarding = async () => {
    if (!manualForm.email || !manualForm.company || !manualForm.qbdId) {
      setMsg({ type: "error", text: "Email, Company, and QuickBooks ID are required." });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/customers/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manualForm)
    });

    if (res.ok) {
      setMsg({ type: "success", text: `Successfully created and invited ${manualForm.company}!` });
      setShowManualModal(false);
      setActiveView("customers");
      fetchData();
    } else {
      const err = await res.json();
      setMsg({ type: "error", text: err.error || "Manual onboarding failed" });
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setMsg({ type: "success", text: `Updating...` });
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setMsg({ type: "success", text: `Status updated.` });
      fetchData();
    } else {
      setMsg({ type: "error", text: "Failed to update." });
    }
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Trade Partners</h1>
          <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.muted }}>Manage portal access and account verification.</p>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button 
            onClick={startManualOnboarding}
            style={{ padding: "10px 20px", background: T.wine, color: "white", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" }}
          >
            ADD TRADE PARTNER
          </button>
          <div style={{ display: "flex", background: T.cream, padding: "4px", borderRadius: "8px" }}>
            <button 
              onClick={() => setActiveView("customers")}
              style={{ padding: "8px 16px", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer", background: activeView === "customers" ? T.paper : "transparent", color: activeView === "customers" ? T.wine : T.muted }}
            >
              ACTIVE USERS
            </button>
            <button 
              onClick={() => setActiveView("requests")}
              style={{ padding: "8px 16px", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer", background: activeView === "requests" ? T.paper : "transparent", color: activeView === "requests" ? T.wine : T.muted, position: "relative" }}
            >
              REQUESTS {requests.length > 0 && <span style={{ position: "absolute", top: -5, right: -5, background: T.red, color: "white", width: "16px", height: "16px", borderRadius: "50%", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>{requests.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {msg && (
        <div style={{ padding: "16px", borderRadius: "8px", background: msg.type === "success" ? `${T.green}15` : `${T.red}15`, color: msg.type === "success" ? T.green : T.red, marginBottom: "24px", fontSize: "13px" }}>
          {msg.text}
          {msg.text.includes("public.customers") && (
            <p style={{ marginTop: "10px", fontWeight: 600 }}>Please apply the SQL migration in the Supabase Dashboard to resolve this error.</p>
          )}
        </div>
      )}

      {/* Manual Onboarding Modal */}
      {showManualModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div style={{ background: "white", width: "100%", maxWidth: "600px", borderRadius: "16px", padding: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "24px" }}>Manually Invite Trade Partner</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input label="Company Name" value={manualForm.company} onChange={v => setManualForm(p => ({...p, company: v}))} />
              <Input label="Contact Name" value={manualForm.repName} onChange={v => setManualForm(p => ({...p, repName: v}))} />
              <Input label="Login Email" value={manualForm.email} onChange={v => setManualForm(p => ({...p, email: v}))} />
              <Input label="QuickBooks ID" value={manualForm.qbdId} onChange={v => setManualForm(p => ({...p, qbdId: v}))} />
              <Input label="License #" value={manualForm.licenseNumber} onChange={v => setManualForm(p => ({...p, licenseNumber: v}))} />
              <Input label="Temporary Password" value={manualForm.password} onChange={v => setManualForm(p => ({...p, password: v}))} />
            </div>

            <div style={{ background: T.bg, padding: "16px", borderRadius: "8px", border: `1px solid ${T.cream}`, marginTop: "24px" }}>
              <p style={{ fontSize: "12px", color: T.ink, margin: 0 }}>This will create the account and send a welcome email immediately.</p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button onClick={() => setShowManualModal(false)} style={{ flex: 1, padding: "14px", background: "none", border: `1px solid ${T.cream}`, borderRadius: "8px", cursor: "pointer", fontSize: "11px", letterSpacing: "1px" }}>CANCEL</button>
              <button 
                disabled={loading} 
                onClick={submitManualOnboarding}
                style={{ flex: 1, padding: "14px", background: T.wine, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "11px", opacity: loading ? 0.6 : 1, fontWeight: 700, letterSpacing: "1px" }}
              >
                {loading ? "PROCESSING..." : "SEND INVITATION"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {onboardingRequest && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div style={{ background: "white", width: "100%", maxWidth: "500px", borderRadius: "16px", padding: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "8px" }}>Approve Trade Access</h2>
            <p style={{ fontSize: "14px", color: T.muted, marginBottom: "24px" }}>Approving for <strong>{onboardingRequest.company}</strong></p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Input label="QuickBooks Customer ID" value={onboardingForm.qbdId} onChange={v => setOnboardingForm(p => ({ ...p, qbdId: v }))} placeholder="e.g. Acme_12345" />
              <Input label="Temporary Password" value={onboardingForm.password} onChange={v => setOnboardingForm(p => ({ ...p, password: v }))} />

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button onClick={() => setOnboardingRequest(null)} style={{ flex: 1, padding: "14px", background: "none", border: `1px solid ${T.cream}`, borderRadius: "8px", cursor: "pointer", fontSize: "11px" }}>CANCEL</button>
                <button 
                  disabled={loading} 
                  onClick={submitOnboarding}
                  style={{ flex: 1, padding: "14px", background: T.wine, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "11px", opacity: loading ? 0.6 : 1, fontWeight: 700 }}
                >
                  {loading ? "SETTING UP..." : "ACTIVATE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", border: `1px solid ${T.cream}`, overflow: "hidden" }}>
        {activeView === "customers" ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr", padding: "16px 24px", background: T.bg, borderBottom: `1px solid ${T.cream}`, fontFamily: ff.b, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, color: T.muted }}>
              <span>Trade Entity / Contact</span>
              <span>Account Credentials</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Management</span>
            </div>
            {loading ? <LoadingIndicator /> : customers.map(c => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr", padding: "20px 24px", borderBottom: `1px solid ${T.cream}`, alignItems: "center" }}>
                <div>
                  <span style={{ display: "block", fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink }}>{c.company}</span>
                  <span style={{ fontSize: "12px", color: T.muted }}>{c.rep_name}</span>
                </div>
                <div style={{ fontSize: "12px", color: T.muted }}>
                  <div style={{ fontWeight: 700, color: T.ink }}>QBD: {c.account_number || "NO_SYNC"}</div>
                  <div style={{ fontSize: "10px" }}>JOINED {new Date(c.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <StatusBadge status={c.status} />
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button onClick={() => updateStatus(c.id, c.status === 'suspended' ? 'active' : 'suspended')} style={{ padding: "8px 12px", background: "none", border: `1px solid ${T.cream}`, borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>
                    {c.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  </button>
                </div>
              </div>
            ))}
            {!loading && customers.length === 0 && <div style={{ padding: "60px", textAlign: "center", color: T.muted }}>No trade partners onboarded yet.</div>}
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", padding: "16px 24px", background: T.bg, borderBottom: `1px solid ${T.cream}`, fontFamily: ff.b, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, color: T.muted }}>
              <span>Requester / Company</span>
              <span>Information</span>
              <span>Date</span>
              <span style={{ textAlign: "right" }}>Action</span>
            </div>
            {loading ? <LoadingIndicator /> : requests.map(r => (
              <div key={r.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", padding: "20px 24px", borderBottom: `1px solid ${T.cream}`, alignItems: "center" }}>
                <div>
                  <span style={{ display: "block", fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink }}>{r.company}</span>
                  <span style={{ fontSize: "12px", color: T.muted }}>{r.full_name}</span>
                </div>
                <div style={{ fontSize: "12px", color: T.muted }}>
                  <div>{r.email}</div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: T.wine }}>LICENSE: {r.license_number || "N/A"}</div>
                </div>
                <div style={{ fontSize: "12px", color: T.muted }}>{new Date(r.created_at).toLocaleDateString()}</div>
                <div style={{ textAlign: "right" }}>
                  <button onClick={() => startOnboarding(r)} style={{ padding: "8px 16px", background: T.wine, color: "white", border: "none", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>APPROVE</button>
                </div>
              </div>
            ))}
            {!loading && requests.length === 0 && <div style={{ padding: "60px", textAlign: "center", color: T.muted }}>No pending access requests.</div>}
          </>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "8px", color: T.muted }}>{label}</label>
      <input 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder} 
        style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px", outline: "none", fontSize: "13px" }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";
  return (
    <span style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", background: active ? `${T.green}15` : `${T.red}15`, color: active ? T.green : T.red, border: `1px solid ${active ? T.green : T.red}30` }}>
      {status}
    </span>
  );
}

function LoadingIndicator() {
  return <div style={{ padding: "60px", textAlign: "center", color: T.muted }}>Fetching trade data...</div>;
}
