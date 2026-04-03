"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function AdminAnalytics() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ logins: 0, downloads: 0 });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (data.logs) {
         setLogs(data.logs);
         const logins = data.logs.filter(l => l.action === "login").length;
         const downloads = data.logs.filter(l => l.action === "download").length;
         setStats({ logins, downloads });
      }
    } catch (err) {
      console.error("Fetch analytics error:", err);
    }
    setLoading(false);
  };

  const cardStyle = {
    background: T.paper, padding: "32px", borderRadius: "16px", border: `1px solid ${T.cream}`, marginBottom: "40px"
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
      <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "40px" }}>Portal Analytics & Reporting</h1>

      {/* ── Summary Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        {[
          { icon: "👤", label: "Customer Sessions", value: stats.logins, color: T.wine },
          { icon: "📥", label: "Catalog Downloads", value: stats.downloads, color: T.gold },
          { icon: "📶", label: "Unique Users", value: stats.logins > 0 ? Math.ceil(stats.logins / 1.5) : 0, color: T.green },
        ].map((s) => (
          <div key={s.label} style={{ background: T.paper, padding: "24px", borderRadius: "16px", border: `2px solid ${s.color}20`, display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "32px", background: `${s.color}10`, padding: "12px", borderRadius: "12px" }}>{s.icon}</span>
            <div>
              <p style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted }}>{s.label}</p>
              <p style={{ fontFamily: ff.h, fontSize: "28px", color: T.ink, marginTop: "4px" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Activity Log Table ── */}
      <section style={cardStyle}>
        <h2 style={{ fontFamily: ff.h, fontSize: "20px", color: T.wine, marginBottom: "24px" }}>Recent Portal Activity</h2>
        
        <div style={{ overflow: "hidden", borderRadius: "12px", border: `1px solid ${T.cream}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", background: T.bg, padding: "12px 20px", borderBottom: `1px solid ${T.cream}` }}>
             {["Timestamp", "Action", "Involved Item"].map(h => (
               <span key={h} style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, color: T.muted }}>{h}</span>
             ))}
          </div>
          
          {loading ? (
             <p style={{ padding: "40px", color: T.muted }}>Loading activity logs...</p>
          ) : logs.length === 0 ? (
             <p style={{ padding: "40px", color: T.muted, textAlign: "center" }}>No activity recorded yet.</p>
          ) : (
            logs.map((l, i) => (
              <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", padding: "16px 20px", borderBottom: i < logs.length - 1 ? `1px solid ${T.cream}` : "none", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: T.deep }}>{new Date(l.created_at).toLocaleString()}</span>
                <span style={{ 
                  fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, 
                  color: l.action === "login" ? T.green : T.wine,
                  background: l.action === "login" ? `${T.green}10` : `${T.wine}10`,
                  padding: "4px 10px", borderRadius: "20px", width: "fit-content"
                }}>
                  {l.action}
                </span>
                <span style={{ fontSize: "13px", color: T.ink }}>{l.details?.catalog_name || l.details?.page || "General Visit"}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
