"use client";

import { useState } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", 
    company: "", 
    email: "", 
    license_number: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/portal/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error || "Submission failed. Please contact us directly.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("A network error occurred.");
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    color: T.paper,
    fontFamily: ff.b,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <section style={{ minHeight: "100vh", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 48px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${T.wineDeep}30 0%, transparent 55%)` }} />

      <div style={{ width: "520px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "36px", color: T.paper, marginBottom: "8px" }}>Trade Access Request</h1>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.warm, letterSpacing: "1px" }}>Apply for a Vinaio Customer Portal Account</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "40px 36px" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>📩</div>
              <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "12px" }}>Request Submitted</h2>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.warm, lineHeight: 1.6, marginBottom: "24px" }}>
                Thank you for your interest in the Vinaio portal. Our team will review your 
                information and business standing. Once verified, a Customer Service 
                representative will create your account and email you your login credentials.
              </p>
              <Link href="/" style={{ color: T.gold, fontFamily: ff.b, fontSize: "12px", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "1px" }}>Return to Homepage</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Full Name</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="John Doe" />
                </div>
                <div>
                  <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Company / Trade Name</label>
                  <input required value={form.company} onChange={e => set("company", e.target.value)} style={inputStyle} placeholder="Acme Wines & Spirits" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Email</label>
                  <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} placeholder="you@company.com" />
                </div>
                <div>
                  <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Phone</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)} style={inputStyle} placeholder="(555) 000-0000" />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Liquor License Number</label>
                <input value={form.license_number} onChange={e => set("license_number", e.target.value)} style={inputStyle} placeholder="NY-LIQ-12345" />
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Comments / Additional Info</label>
                <textarea 
                  value={form.message} 
                  onChange={e => set("message", e.target.value)} 
                  style={{ ...inputStyle, height: "80px", resize: "none" }} 
                  placeholder="Tell us about your portfolio needs..." 
                />
              </div>

              {status === "error" && <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.red, marginBottom: "20px" }}>{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ width: "100%", padding: "16px", background: T.wine, border: "none", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", opacity: status === "sending" ? 0.6 : 1, transition: "all 0.3s" }}
              >
                {status === "sending" ? "Submitting Request…" : "Send Access Request"}
              </button>
            </form>
          )}
          <div style={{ borderTop: `1px solid ${T.white}10`, marginTop: "32px", paddingTop: "24px", textAlign: "center" }}>
            <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.warm }}>
              Existing customer?{" "}
              <Link href="/portal/login" style={{ color: T.gold, fontWeight: 600 }}>Sign in to Portal →</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
