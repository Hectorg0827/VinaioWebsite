"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function AdminCatalogManager() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", file_url: "", category_filter: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const res = await fetch("/api/admin/catalogs");
      const data = await res.json();
      if (data.catalogs) setCatalogs(data.catalogs);
    } catch (err) {
      console.error("Fetch catalogs error:", err);
    }
    setLoading(false);
  };

  const saveCatalog = async () => {
    if (!form.name || !form.file_url) return setMsg({ type: "error", text: "Name and File are required." });
    setSaving(true);
    try {
      const res = await fetch("/api/admin/catalogs", {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Catalog added!" });
        setForm({ name: "", file_url: "", category_filter: "" });
        fetchCatalogs();
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to save." });
    }
    setSaving(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "catalogs");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.publicUrl) {
        setForm({ ...form, file_url: data.publicUrl });
        setMsg({ type: "success", text: "PDF uploaded! Click 'Upload Catalog' to finalize." });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      setMsg({ type: "error", text: `Upload Error: ${err.message}` });
    }
    setSaving(false);
  };

  const deleteCatalog = async (id) => {
    if (!confirm("Permanently delete this catalog?")) return;
    try {
      const res = await fetch(`/api/admin/catalogs?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCatalogs();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const cardStyle = {
    background: T.paper, padding: "32px", borderRadius: "16px", border: `1px solid ${T.cream}`, marginBottom: "40px"
  };

  const inputStyle = {
    width: "100%", padding: "12px", background: T.bg, border: `1px solid ${T.cream}`,
    borderRadius: "8px", fontFamily: ff.b, fontSize: "14px", color: T.ink, outline: "none", marginBottom: "16px"
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
      <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "40px" }}>Customer Catalogs</h1>

      {/* ── Add Catalog Form ── */}
      <section style={cardStyle}>
        <h2 style={{ fontFamily: ff.h, fontSize: "20px", color: T.wine, marginBottom: "24px" }}>Add New PDF Catalog</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Catalog Display Name</label>
            <input 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              style={inputStyle} 
              placeholder="e.g. Vinaio Imports - Full Portfolio 2024"
            />
            
            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>File URL (PDF)</label>
            <input 
              value={form.file_url} 
              onChange={(e) => setForm({ ...form, file_url: e.target.value })} 
              style={inputStyle} 
              placeholder="https://... (direct link to PDF)"
            />

            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Category (Optional)</label>
            <input 
              value={form.category_filter} 
              onChange={(e) => setForm({ ...form, category_filter: e.target.value })} 
              style={inputStyle} 
              placeholder="e.g. Wine (filters for specific portals)"
            />

            <button 
              onClick={saveCatalog} 
              disabled={saving}
              style={{ padding: "12px 24px", background: T.wine, color: T.paper, border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: ff.b, fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px" }}
            >
              {saving ? "Saving..." : "Upload Catalog"}
            </button>
          </div>
          
          <div style={{ background: T.bg, padding: "24px", borderRadius: "12px", border: `1px dashed ${T.cream}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "40px", marginBottom: "16px" }}>📄</span>
            <input 
              type="file" 
              id="pdf-upload" 
              style={{ display: "none" }} 
              accept=".pdf" 
              onChange={handleFileUpload} 
            />
            <label 
              htmlFor="pdf-upload" 
              style={{ padding: "10px 20px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "6px", cursor: "pointer", fontFamily: ff.b, fontSize: "11px", letterSpacing: "1px" }}
            >
              {saving ? "Uploading..." : form.file_url ? "✓ File Ready" : "Select PDF File"}
            </label>
            <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted, textAlign: "center", marginTop: "16px" }}>
              PDF catalogs uploaded here will be available for customers to download.
            </p>
          </div>
        </div>
      </section>

      {/* ── List of Catalogs ── */}
      <section style={cardStyle}>
        <h2 style={{ fontFamily: ff.h, fontSize: "20px", color: T.wine, marginBottom: "24px" }}>Library</h2>
        
        {loading ? (
          <p style={{ color: T.muted }}>Loading catalogs...</p>
        ) : catalogs.length === 0 ? (
          <p style={{ color: T.muted, textAlign: "center", padding: "40px" }}>No catalogs uploaded yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {catalogs.map((c) => (
              <div key={c.id} style={{ 
                background: T.bg, padding: "20px", borderRadius: "12px", border: `1px solid ${T.cream}`,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <p style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.ink }}>{c.name}</p>
                  <p style={{ fontSize: "11px", color: T.muted }}>{c.category_filter || "Full Catalog"}</p>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <a href={c.file_url} target="_blank" style={{ fontSize: "18px", textDecoration: "none" }}>👁️</a>
                  <button onClick={() => deleteCatalog(c.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
