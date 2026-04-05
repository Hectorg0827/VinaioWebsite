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
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]   = useState("");
  const [activeLevel, setActiveLevel] = useState("all");
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
    setMsg({ type: "success", text: "Syncing photo to cloud..." });

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
        setMsg({ type: "success", text: "Photo synced successfully!" });
      } else { throw new Error(data.error); }
    } catch (err) { setMsg({ type: "error", text: "Upload failed." }); }
    finally { setLoading(false); }
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
        setMsg({ type: "success", text: `Successfully ${editing ? 'updated' : 'added'} ${form.name}!` });
        setShowForm(false);
        setEditing(null);
        setForm(EMPTY_MEMBER);
        fetchTeam();
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.error || "Save failed." });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Database connection failed." });
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_MEMBER);
    setShowForm(true);
    setMsg(null);
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
    setShowForm(true);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMember = async (id) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMsg({ type: "success", text: "Member removed from records." });
      fetchTeam();
    }
    setLoading(false);
  };

  const filtered = members.filter(m => {
    const matchesSearch = (m.name + m.role).toLowerCase().includes(search.toLowerCase());
    const matchesLevel  = activeLevel === "all" || m.level === activeLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", gap: "24px", flexWrap: "wrap" }}>
        <div>
          <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "36px", color: T.ink, marginBottom: "8px" }}>Team Management</h1>
          <p style={{ fontSize: "14px", color: T.muted }}>Curate and manage your organizational hierarchy.</p>
        </div>
        
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
           <input 
             value={search} 
             onChange={e => setSearch(e.target.value)} 
             placeholder="Search members..." 
             style={{ padding: "14px 20px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "10px", width: "280px", outline: "none", fontSize: "14px" }} 
           />
           <button 
             onClick={openAdd}
             style={{ padding: "14px 28px", background: T.wine, color: "white", borderRadius: "10px", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", border: "none", boxShadow: `0 4px 12px ${T.wine}20` }}
           >
             + Add Member
           </button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: "16px 24px", borderRadius: "10px", background: msg.type === "error" ? `${T.red}10` : `${T.wine}10`, border: `1px solid ${msg.type === "error" ? T.red : T.wine}30`, color: msg.type === "error" ? T.red : T.ink, fontSize: "13px", marginBottom: "40px" }}>
          {msg.text}
        </div>
      )}

      {/* Togglable Editor */}
      {showForm && (
        <div style={{ background: T.paper, padding: "48px", borderRadius: "20px", border: `1px solid ${T.wine}20`, marginBottom: "64px", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
           <button onClick={() => setShowForm(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: T.muted }}>×</button>
           <h2 style={{ fontFamily: ff.h, fontSize: "24px", marginBottom: "40px", color: T.ink }}>{editing ? `Edit: ${form.name}` : "Member Profile Details"}</h2>
           
           <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr", gap: "48px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "200px", height: "200px", margin: "0 auto 20px", borderRadius: "16px", background: T.bg, border: `1px dashed ${T.cream}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {form.photo_url ? <img src={form.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "10px", color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Upload Headshot</span>}
                </div>
                <input type="file" id="photo-up" style={{ display: "none" }} accept="image/*" onChange={handlePhotoUpload} />
                <label htmlFor="photo-up" style={{ padding: "10px 24px", background: T.bg, border: `1px solid ${T.cream}`, borderRadius: "30px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>{loading ? "..." : "Change Image"}</label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                 <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, color: T.muted, display: "block", marginBottom: "10px" }}>Primary Identity</label>
                    <input value={form.name} onChange={e => set("name", e.target.value)} style={{ width: "100%", padding: "14px", background: "white", border: `1px solid ${T.cream}`, borderRadius: "10px" }} placeholder="Full Name" />
                 </div>
                 <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, color: T.muted, display: "block", marginBottom: "10px" }}>Corporate Title</label>
                    <input value={form.role} onChange={e => set("role", e.target.value)} style={{ width: "100%", padding: "14px", background: "white", border: `1px solid ${T.cream}`, borderRadius: "10px" }} placeholder="e.g. Regional Manager" />
                 </div>
                 <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, color: T.muted, display: "block", marginBottom: "10px" }}>Professional Bio</label>
                    <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={4} style={{ width: "100%", padding: "14px", background: "white", border: `1px solid ${T.cream}`, borderRadius: "10px", resize: "none" }} placeholder="Brief biography or expertise summary..." />
                 </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                 <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, color: T.muted, display: "block", marginBottom: "10px" }}>Organizational Level</label>
                    <select value={form.level} onChange={e => set("level", e.target.value)} style={{ width: "100%", padding: "14px", background: "white", border: `1px solid ${T.cream}`, borderRadius: "10px" }}>
                      {TEAM_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>
                 </div>
                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, color: T.muted, display: "block", marginBottom: "10px" }}>Sorting Index</label>
                      <input type="number" value={form.order} onChange={e => set("order", parseInt(e.target.value))} style={{ width: "100%", padding: "14px", border: `1px solid ${T.cream}`, borderRadius: "10px" }} />
                    </div>
                    <div style={{ alignSelf: "end", display: "flex", alignItems: "center", gap: "12px", height: "54px" }}>
                       <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} style={{ width: "18px", height: "18px" }} />
                       <span style={{ fontSize: "12px", fontWeight: 600 }}>Listed Active</span>
                    </div>
                 </div>
                 <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
                    <button onClick={saveMember} disabled={loading} style={{ flex: 1, padding: "16px", background: T.wine, color: "white", border: "none", borderRadius: "12px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>{loading ? "..." : editing ? "Update Records" : "Establish Member"}</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "40px", borderBottom: `1px solid ${T.cream}`, paddingBottom: "20px" }}>
        {["all", ...TEAM_LEVELS.map(l => l.id)].map(levelId => (
          <button 
            key={levelId} 
            onClick={() => setActiveLevel(levelId)}
            style={{ 
              padding: "10px 24px", borderRadius: "30px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.3s",
              background: activeLevel === levelId ? T.wine : "transparent",
              color: activeLevel === levelId ? "white" : T.muted
            }}
          >
            {levelId === "all" ? "Whole Team" : TEAM_LEVELS.find(l => l.id === levelId)?.label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Team Catalog Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        {filtered.map(m => (
          <div key={m.id} style={{ 
            background: T.paper, padding: "32px", borderRadius: "16px", border: `1px solid ${T.cream}`, 
            display: "flex", flexDirection: "column", gap: "20px", transition: "all 0.4s",
            opacity: m.active ? 1 : 0.5,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "12px", background: T.bg, flexShrink: 0, overflow: "hidden", border: `2px solid ${m.active ? T.gold : T.cream}` }}>
                {m.photo_url ? <img src={m.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: ff.b, fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>{m.name}</h4>
                <p style={{ fontSize: "12px", color: T.wine, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{m.role}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                 <button onClick={() => startEdit(m)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: T.bg, border: "none", cursor: "pointer", fontSize: "14px" }}>✏️</button>
                 <button onClick={() => deleteMember(m.id)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: T.bg, border: "none", cursor: "pointer", fontSize: "14px" }}>🗑️</button>
              </div>
            </div>
            {m.desc && <p style={{ fontSize: "12px", color: T.muted, lineHeight: 1.6, margin: 0 }}>{m.desc.length > 100 ? m.desc.substring(0, 97) + "..." : m.desc}</p>}
            <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${T.bg}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", color: T.muted }}>{m.level} · Order {m.order}</span>
               <span style={{ fontSize: "9px", padding: "4px 10px", borderRadius: "20px", background: m.active ? `${T.gold}20` : T.bg, color: m.active ? T.ink : T.muted, fontWeight: 700 }}>{m.active ? "ACTIVE" : "INACTIVE"}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "100px 0", color: T.muted }}>No team members found matching your filters.</div>
        )}
      </div>
    </div>
  );
}
