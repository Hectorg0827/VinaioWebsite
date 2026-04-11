"use client";

import { useState } from "react";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", password: "", license_number: ""
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/portal/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error || "Registration failed.");
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

      <div style={{ width: "480px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "36px", color: T.paper, marginBottom: "8px" }}>Trade Registration</h1>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.warm }}>Apply for a Vinaio B2B Customer Account</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "40px 36px" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>📩</div>
              <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "12px" }}>Application Received</h2>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.warm, lineHeight: 1.6, marginBottom: "24px" }}>
                Thank you for applying. To maintain the integrity of our wholesale pricing, 
                all accounts must be manually reviewed by our compliance team. 
                You will receive an email once your account is activated.
              </p>
              <Link href="/" style={{ color: T.gold, fontFamily: ff.b, fontSize: "12px", textDecoration: "underline" }}>Return to Homepage</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Full Name</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="John Doe" />
                </div>
                <div>
                  <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Company</label>
                  <input required value={form.company} onChange={e => set("company", e.target.value)} style={inputStyle} placeholder="Acme Bar & Grill" />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Liquor License #</label>
                <input value={form.license_number} onChange={e => set("license_number", e.target.value)} style={inputStyle} placeholder="NY-LIQ-12345" />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Email Address</label>
                <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} placeholder="you@company.com" />
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Choose Password</label>
                <input required type="password" value={form.password} onChange={e => set("password", e.target.value)} style={inputStyle} placeholder="••••••••" />
              </div>

              {status === "error" && <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.red, marginBottom: "20px" }}>{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ width: "100%", padding: "16px", background: T.wine, border: "none", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", opacity: status === "sending" ? 0.6 : 1 }}
              >
                {status === "sending" ? "Submitting Application…" : "Apply for Access"}
              </button>
            </form>
          )}
        </div>

        <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.warm, textAlign: "center", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link href="/portal/login" style={{ color: T.gold }}>Sign in here →</Link>
        </p>
      </div>
    </section>
  );
}
