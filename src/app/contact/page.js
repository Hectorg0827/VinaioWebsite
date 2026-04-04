"use client";

import { useState } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", company: "", license_number: "", email: "",
    phone: "", inquiry_type: "general", message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    background: T.bg,
    border: `1px solid ${T.cream}`,
    borderRadius: "6px",
    fontFamily: ff.b,
    fontSize: "14px",
    color: T.ink,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontFamily: ff.b,
    fontSize: "9px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: T.warm,
    display: "block",
    marginBottom: "8px",
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: T.ink,
          padding: "140px 56px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 70% at 60% 50%, ${T.wineDeep}40 0%, transparent 55%)` }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
          <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: T.gold, marginBottom: "16px" }}>
            Contact
          </p>
          <h1 style={{ fontFamily: ff.h, fontSize: "clamp(44px, 6vw, 76px)", color: T.paper, lineHeight: 0.92 }}>
            Let&apos;s start<br /><em>a conversation</em>
          </h1>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <section style={{ background: T.bg, padding: "80px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: "64px", alignItems: "flex-start" }}>

          {/* ── Form ── */}
          <Reveal>
            <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Send a Message</h2>
            <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, marginBottom: "40px", lineHeight: 1.7 }}>
              We respond within 1 business day. For urgent inquiries, call your sales rep directly.
            </p>

            {status === "success" ? (
              <div style={{ padding: "40px 32px", background: T.greenLight, border: `1px solid ${T.green}30`, borderRadius: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>✓</div>
                <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.green, marginBottom: "8px" }}>Message received</h3>
                <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.deep, lineHeight: 1.7 }}>
                  Thank you for reaching out. A member of our team will be in touch within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input required value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} placeholder="Maria Rodriguez" />
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input value={form.company} onChange={(e) => set("company", e.target.value)} style={inputStyle} placeholder="Rodriguez Wine & Spirits" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} style={inputStyle} placeholder="you@yourcompany.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} placeholder="(212) 555-0100" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Liquor License # (optional)</label>
                    <input value={form.license_number} onChange={(e) => set("license_number", e.target.value)} style={inputStyle} placeholder="NY-LIQ-2024-XXXXX" />
                  </div>
                  <div>
                    <label style={labelStyle}>Inquiry Type</label>
                    <select value={form.inquiry_type} onChange={(e) => set("inquiry_type", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                      <option value="general">General Inquiry</option>
                      <option value="distribution">Distribution Partnership</option>
                      <option value="import">Import Services</option>
                      <option value="white_label">White Label Program</option>
                      <option value="spain">Vinaio Spain & Europe</option>
                      <option value="customer">Existing Customer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={6}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Tell us about your business and how we can help..."
                  />
                </div>
                {status === "error" && (
                  <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.red }}>
                    There was an error sending your message. Please try again or email us directly.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    padding: "16px 40px",
                    background: T.wine,
                    border: "none",
                    borderRadius: "6px",
                    color: T.paper,
                    fontFamily: ff.b,
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    opacity: status === "sending" ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </Reveal>

          {/* ── Sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Reveal delay={0.15}>
              {/* Sales rep card */}
              <div style={{ padding: "32px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "10px" }}>
                <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, marginBottom: "16px" }}>Your Sales Rep</p>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: T.wineGlow, border: `2px solid ${T.wine}20`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff.h, fontSize: "22px", color: T.wine }}>
                    H
                  </div>
                  <div>
                    <p style={{ fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink }}>Hector Garcia</p>
                    <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted }}>Sales Director</p>
                  </div>
                </div>
                {[
                  { label: "Phone", value: "(718) 842-7201", href: "tel:+17188427201" },
                  { label: "Email", value: "c.s@vinaioimports.com", href: "mailto:c.s@vinaioimports.com" },
                ].map((c) => (
                  <div key={c.label} style={{ marginBottom: "12px" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginBottom: "2px" }}>{c.label}</p>
                    <a href={c.href} style={{ fontFamily: ff.b, fontSize: "13px", color: T.wine, textDecoration: "none" }}>{c.value}</a>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              {/* Office info */}
              <div style={{ padding: "28px 32px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "10px" }}>
                <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, marginBottom: "16px" }}>Office</p>
                {[
                  ["Location", "New York Metropolitan Area"],
                  ["Hours", "Mon – Fri · 9:00am – 6:00pm ET"],
                  ["Response Time", "Within 1 business day"],
                ].map(([k, v]) => (
                  <div key={k} style={{ marginBottom: "14px" }}>
                    <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, marginBottom: "2px" }}>{k}</p>
                    <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.ink }}>{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              {/* Quick links */}
              <div style={{ padding: "28px 32px", background: T.cream, borderRadius: "10px" }}>
                <p style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, marginBottom: "16px" }}>Existing Customers</p>
                <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.deep, lineHeight: 1.7, marginBottom: "16px" }}>
                  Already a Vinaio customer? Log into the Customer Portal to place orders, manage invoices, and access your account.
                </p>
                <a href="/portal" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.wine, fontWeight: 600 }}>
                  Customer Portal →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
