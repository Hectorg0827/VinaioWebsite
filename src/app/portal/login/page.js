"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";

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
      router.push("/portal");
      router.refresh();
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (!email) { setError("Enter your email above first."); return; }
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/login`,
    });
    setResetSent(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: T.paper,
    border: `1px solid ${T.cream}`,
    borderRadius: "6px",
    color: T.ink,
    fontFamily: ff.b,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        background: T.bg,
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
          <Hr w="32px" c={T.wine} style={{ margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "36px", color: T.ink, marginBottom: "8px" }}>Customer Portal</h1>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted }}>Sign in to manage orders, invoices, and more</p>
        </div>

        <div style={{ background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "10px", padding: "40px 36px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
          {resetSent ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.ink, marginBottom: "8px" }}>Password reset email sent</p>
              <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted }}>Check your inbox for a reset link.</p>
            </div>
          ) : (
            <form onSubmit={login}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.muted, display: "block", marginBottom: "8px" }}>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@yourcompany.com" />
              </div>
              <div style={{ marginBottom: "28px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.muted, display: "block", marginBottom: "8px" }}>Password</label>
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
          <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted, textAlign: "center", marginTop: "20px" }}>
            Forgot password?{" "}
            <span onClick={resetPassword} style={{ color: T.wine, cursor: "pointer", fontWeight: 600 }}>Reset here</span>
          </p>
        </div>

        <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted, textAlign: "center", marginTop: "24px" }}>
          Not a customer?{" "}
          <a href="/contact" style={{ color: T.wine, fontWeight: 600 }}>Get in touch →</a>
        </p>
      </div>
    </section>
  );
}
