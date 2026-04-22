"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check if we have a recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If no session, it might be an invalid or expired link
        setError("Your reset link has expired or is invalid. Please request a new one.");
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.updateUser({ password });

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/portal/login");
      }, 3000);
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
          <h1 style={{ fontFamily: ff.h, fontSize: "36px", color: T.paper, marginBottom: "8px" }}>Set New Password</h1>
          <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.warm }}>Security check passed. Choose a new secure password.</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "40px 36px" }}>
          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>✓</div>
              <p style={{ fontFamily: ff.b, fontSize: "14px", color: T.paper, marginBottom: "8px" }}>Password Updated Successfully</p>
              <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.warm }}>Redirecting you to login...</p>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>New Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
              </div>
              <div style={{ marginBottom: "28px" }}>
                <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>Confirm Password</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
              </div>
              
              {error && <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.red, marginBottom: "16px" }}>{error}</p>}
              
              <button
                type="submit"
                disabled={loading || !!error.includes("expired")}
                style={{ width: "100%", padding: "16px", background: T.wine, border: "none", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
