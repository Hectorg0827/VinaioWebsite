"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Invalid credentials.");
    }
    setLoading(false);
  };

  return (
    <section style={{ minHeight: "100vh", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${T.wineDeep}30 0%, transparent 55%)` }} />
      <div style={{ width: "380px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Hr w="28px" c={T.gold} style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "6px" }}>Admin Panel</h1>
          <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.warm }}>Vinaio Imports · Product Management</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "36px 32px" }}>
          <form onSubmit={submit}>
            <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Leave blank for legacy login"
              style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "20px" }}
            />

            <label style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "20px" }}
            />
            {error && <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.red, marginBottom: "12px" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "14px", background: T.wine, border: "none", borderRadius: "6px", color: T.paper, fontFamily: ff.b, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
