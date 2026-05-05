"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function AdminUserManager() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (data.admins) setAdmins(data.admins);
    } catch (e) {
      setMsg({ type: "error", text: "Failed to load admin users." });
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: `Admin user "${form.username}" created.` });
        setForm({ username: "", password: "" });
        setShowForm(false);
        fetchAdmins();
      } else {
        setMsg({ type: "error", text: data.error || "Failed to create user." });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id, username) => {
    if (!confirm(`Are you sure you want to delete admin user "${username}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/admins?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMsg({ type: "success", text: "User removed." });
        fetchAdmins();
      }
    } catch (e) {
      setMsg({ type: "error", text: "Failed to delete user." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>Admin Access Control</h1>
          <p style={{ fontSize: "14px", color: T.muted }}>Manage team members with administrative privileges.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "12px 24px", background: T.wine, color: "white", borderRadius: "8px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", border: "none" }}
        >
          {showForm ? "Cancel" : "+ Add Admin"}
        </button>
      </div>

      {msg && (
        <div style={{ padding: "16px", background: msg.type === "error" ? "#fee2e2" : `${T.wine}10`, color: msg.type === "error" ? "#b91c1c" : T.ink, borderRadius: "8px", marginBottom: "24px", fontSize: "13px" }}>
          {msg.text}
        </div>
      )}

      {showForm && (
        <div style={{ background: T.paper, padding: "32px", borderRadius: "16px", border: `1px solid ${T.cream}`, marginBottom: "40px" }}>
          <h2 style={{ fontFamily: ff.h, fontSize: "20px", marginBottom: "24px" }}>Create New Admin</h2>
          <form onSubmit={addAdmin} style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <input 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              style={{ flex: 1, minWidth: "200px", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }}
            />
            <input 
              type="password"
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              style={{ flex: 1, minWidth: "200px", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }}
            />
            <button 
              type="submit"
              disabled={loading}
              style={{ padding: "12px 32px", background: T.ink, color: "white", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
            >
              {loading ? "..." : "Create User"}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: T.paper, borderRadius: "16px", border: `1px solid ${T.cream}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: T.bg, textAlign: "left" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600 }}>Username</th>
              <th style={{ padding: "16px 24px", fontWeight: 600 }}>Added On</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} style={{ borderTop: `1px solid ${T.cream}` }}>
                <td style={{ padding: "16px 24px", fontWeight: 500 }}>{a.username}</td>
                <td style={{ padding: "16px 24px", color: T.muted }}>{new Date(a.created_at).toLocaleDateString()}</td>
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  <button 
                    onClick={() => deleteAdmin(a.id, a.username)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && !loading && (
              <tr>
                <td colSpan="3" style={{ padding: "40px", textAlign: "center", color: T.muted }}>No multi-user admins configured yet. (Legacy login still active)</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
