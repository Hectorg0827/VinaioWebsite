"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";
import * as analytics from "@/lib/analytics";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
    } else {
      analytics.event({ action: "portal_login", category: "portal" });
      router.push("/portal");
      router.refresh();
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (!email) {
      setError("Please enter your email above to receive a reset link.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    
    if (err) {
      setError(err.message);
    } else {
      setResetSent(true);
      setError(""); // Clear any old errors
    }
    setLoading(false);
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
    <section
      style={{
        minHeight: "100vh",
        background: T.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 48px",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${T.wineDeep}30 0%, transparent 55%)` }} />

      <div style={{ width: "420px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Hr w="32px" c={T.gold} style={{ margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "36px", color: T.paper, marginBottom: "8px" }}>Customer Portal</h1>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.warm }}>Sign in to manage orders, invoices, and more</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "40px 36px" }}>
          {resetSent ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.paper, marginBottom: "8px" }}>Password reset email sent</p>
              <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.warm }}>Check your inbox for a reset link.</p>
            </div>
          ) : (
            <form onSubmit={login}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@yourcompany.com" />
              </div>
              <div style={{ marginBottom: "28px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
              </div>
              {error && <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.red, marginBottom: "16px" }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "16px", background: T.wine, border: "none", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}
          <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.warm, textAlign: "center", marginTop: "20px" }}>
            Forgot password?{" "}
            <span onClick={resetPassword} style={{ color: T.gold, cursor: "pointer" }}>Reset here</span>
          </p>
        </div>

        <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.warm, textAlign: "center", marginTop: "24px" }}>
          Not a customer?{" "}
          <Link href="/portal/register" style={{ color: T.gold }}>Apply for access →</Link>
        </p>
      </div>
    </section>
  );
}
