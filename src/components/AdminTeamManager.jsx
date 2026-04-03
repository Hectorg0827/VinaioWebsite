"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { createClient } from "@/lib/supabase/client";

const TEAM_LEVELS = [
  { id: "executive", label: "Executive Leadership" },
  { id: "leadership", label: "Management & Operations" },
  { id: "sales",      label: "Sales Force" },
  { id: "advisor",    label: "Expert Advisors" },
];

const EMPTY_MEMBER = {
  name: "",
  role: "",
  desc: "",
  level: "sales",
  photo_url: "",
  active: true,
  order: 0
};

export default function AdminTeamManager() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY_MEMBER);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState(null);
  const supabase = createClient();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_team")
      .select("*")
      .order("order", { ascending: true })
      .order("name", { ascending: true });
    
    if (data) setMembers(data);
    setLoading(false);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMsg({ type: "success", text: "Uploading photo..." });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "team");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.publicUrl) {
        set("photo_url", data.publicUrl);
        setMsg({ type: "success", text: "Photo uploaded!" });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      setMsg({ type: "error", text: `Upload Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const saveMember = async () => {
    if (!form.name || !form.role) return setMsg({ type: "error", text: "Name and Role are required." });
    
    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/team/${editing}` : "/api/admin/team";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg({ type: "success", text: "Team member saved!" });
        setEditing(null);
        setForm(EMPTY_MEMBER);
        fetchTeam();
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.error || "Save failed." });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (m) => {
    setEditing(m.id);
    setForm({
      name: m.name || "",
      role: m.role || "",
      desc: m.desc || "",
      level: m.level || "sales",
      photo_url: m.photo_url || "",
      active: m.active ?? true,
      order: m.order || 0
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMember = async (id) => {
    if (!confirm("Delete this team member?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMsg({ type: "success", text: "Deleted." });
      fetchTeam();
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <Hr w="40px" c={T.gold} style={{ marginBottom: "20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Team Management</h1>
          <p style={{ fontSize: "14px", color: T.muted }}>Manage members across all organizational levels.</p>
        </div>
      </div>

      {msg && (
        <div style={{ 
          padding: "16px 24px", borderRadius: "8px", marginBottom: "32px", 
          background: msg.type === "error" ? `${T.red}10` : `${T.wine}10`,
          border: `1px solid ${msg.type === "error" ? T.red : T.wine}20`,
          color: msg.type === "error" ? T.red : T.ink,
          fontFamily: ff.b, fontSize: "13px"
        }}>
          {msg.text}
        </div>
      )}

      {/* Editor Form */}
      <div style={{ background: T.paper, padding: "40px", borderRadius: "16px", border: `1px solid ${T.cream}`, marginBottom: "48px" }}>
        <h2 style={{ fontFamily: ff.h, fontSize: "20px", marginBottom: "32px" }}>
          {editing ? `Edit ${form.name}` : "Add New Team Member"}
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr", gap: "32px" }}>
          {/* Photo Section */}
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              width: "160px", height: "160px", margin: "0 auto 16px", background: T.bg, borderRadius: "50%", 
              border: `1px dashed ${T.cream}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" 
            }}>
              {form.photo_url ? (
                <img src={form.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "10px", color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>No Photo</span>
              )}
            </div>
            <input type="file" id="member-photo" style={{ display: "none" }} accept="image/*" onChange={handlePhotoUpload} />
            <label htmlFor="member-photo" style={{ 
              display: "inline-block", padding: "8px 20px", background: T.bg, borderRadius: "20px", 
              fontSize: "11px", fontWeight: 600, cursor: "pointer", border: `1px solid ${T.cream}` 
            }}>
              {loading ? "..." : "Upload Photo"}
            </label>
          </div>

          {/* Details Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Full Name</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="e.g. Joan Altés" />
            </div>
            <div>
              <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Job Title / Role</label>
              <input value={form.role} onChange={e => set("role", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="e.g. Chief Executive Officer" />
            </div>
            <div>
              <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Bio / Description</label>
              <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={4} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px", resize: "none" }} placeholder="Tasting notes on their career..." />
            </div>
          </div>

          {/* Settings Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Hierarchy Level</label>
              <select value={form.level} onChange={e => set("level", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px", background: "white" }}>
                {TEAM_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
               <div>
                  <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Display Order</label>
                  <input type="number" value={form.order} onChange={e => set("order", parseInt(e.target.value))} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} />
               </div>
               <div style={{ alignSelf: "end", display: "flex", alignItems: "center", gap: "10px", height: "48px" }}>
                  <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} />
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>Active</span>
               </div>
            </div>
            
            <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
              {editing && <button onClick={() => { setEditing(null); setForm(EMPTY_MEMBER); }} style={{ flex: 1, padding: "14px", background: "none", border: `1px solid ${T.cream}`, borderRadius: "8px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>Cancel</button>}
              <button onClick={saveMember} disabled={loading} style={{ flex: 2, padding: "14px", background: T.wine, color: "white", border: "none", borderRadius: "8px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
                {loading ? "Saving..." : editing ? "Update Member" : "Add to Team"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid by Level */}
      {TEAM_LEVELS.map(level => {
        const levelMembers = members.filter(m => m.level === level.id);
        if (levelMembers.length === 0) return null;

        return (
          <div key={level.id} style={{ marginBottom: "56px" }}>
            <h3 style={{ fontFamily: ff.h, fontSize: "18px", color: T.ink, marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
              {level.label}
              <span style={{ fontSize: "12px", color: T.muted, fontWeight: 400 }}>({levelMembers.length})</span>
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {levelMembers.map(m => (
                <div key={m.id} style={{ 
                  background: T.paper, padding: "24px", borderRadius: "12px", border: `1px solid ${T.cream}`, 
                  display: "flex", alignItems: "center", gap: "16px", position: "relative",
                  opacity: m.active ? 1 : 0.6
                }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: T.bg, flexShrink: 0, overflow: "hidden", border: `2px solid ${m.active ? T.gold : T.cream}` }}>
                    {m.photo_url ? <img src={m.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 600, margin: 0 }}>{m.name}</h4>
                    <p style={{ fontSize: "11px", color: T.wine, margin: 0 }}>{m.role}</p>
                    <p style={{ fontSize: "10px", color: T.muted, marginTop: "4px" }}>Order: {m.order}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button onClick={() => startEdit(m)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>✏️</button>
                    <button onClick={() => deleteMember(m.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
