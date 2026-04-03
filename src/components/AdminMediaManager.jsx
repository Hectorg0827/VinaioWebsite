"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function AdminMediaManager() {
  const [hero, setHero] = useState({ url: "", title: "", subtitle: "", type: "video" });
  const [partners, setPartners] = useState([]);
  const [savingHero, setSavingHero] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const resHero = await fetch("/api/admin/hero");
      const dataHero = await resHero.json();
      if (dataHero.hero) setHero(dataHero.hero);

      const resPart = await fetch("/api/admin/partners");
      const dataPart = await resPart.json();
      if (dataPart.partners) setPartners(dataPart.partners);
    } catch (err) {
      console.error("Fetch media error:", err);
    }
  };

  const saveHero = async () => {
    setSavingHero(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        body: JSON.stringify(hero),
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Hero updated!" });
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to save hero settings." });
    }
    setSavingHero(false);
  };

  const handleHeroFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSavingHero(true);
    const type = file.type.startsWith("video") ? "video" : "image";
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "hero");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.publicUrl) {
        setHero({ ...hero, url: data.publicUrl, type });
        setMsg({ type: "success", text: "File uploaded! Save to apply." });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      setMsg({ type: "error", text: `Upload Error: ${err.message}` });
    }
    setSavingHero(false);
  };

  const handleAddBrand = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = prompt("Brand name?");
    if (!name) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "logos");

    try {
      const resUpload = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const dataUpload = await resUpload.json();
      
      if (resUpload.ok && dataUpload.publicUrl) {
        const resDb = await fetch("/api/admin/partners", {
          method: "POST",
          body: JSON.stringify({ name, logo_url: dataUpload.publicUrl, active: true, order: partners.length })
        });
        const dataDb = await resDb.json();
        
        if (resDb.ok && dataDb.partner) {
          setPartners([...partners, dataDb.partner]);
          setMsg({ type: "success", text: "New brand added!" });
        }
      } else {
        throw new Error(dataUpload.error || "Logo upload failed");
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
    setUploadingLogo(false);
  };

  const togglePartner = async (id, currentStatus) => {
    try {
      const res = await fetch("/api/admin/partners", {
        method: "PATCH",
        body: JSON.stringify({ id, active: !currentStatus })
      });
      if (res.ok) {
        setPartners(partners.map(p => p.id === id ? { ...p, active: !currentStatus } : p));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const deletePartner = async (id) => {
    if (!confirm("Remove this brand logo?")) return;
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPartners(partners.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ── Styles ──────────────────────────────────
  const cardStyle = {
    background: T.paper,
    padding: "32px",
    borderRadius: "16px",
    border: `1px solid ${T.cream}`,
    marginBottom: "40px"
  };

  const inputStyle = {
    width: "100%", padding: "12px", background: T.bg, border: `1px solid ${T.cream}`,
    borderRadius: "8px", fontFamily: ff.b, fontSize: "14px", color: T.ink, outline: "none", marginBottom: "16px"
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
      <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "40px" }}>Media & Branding</h1>

      {/* ── Hero Management ── */}
      <section style={cardStyle}>
        <h2 style={{ fontFamily: ff.h, fontSize: "20px", color: T.wine, marginBottom: "24px" }}>Landing Hero (Vineyard Video)</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Video / Header Image URL</label>
            <input 
              value={hero.url} 
              onChange={(e) => setHero({ ...hero, url: e.target.value })} 
              style={inputStyle} 
              placeholder="https://... (CDN or Supabase Storage link)"
            />
            
            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Title Overlay</label>
            <input 
              value={hero.title} 
              onChange={(e) => setHero({ ...hero, title: e.target.value })} 
              style={inputStyle}
            />

            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Subtitle</label>
            <input 
              value={hero.subtitle} 
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} 
              style={inputStyle}
            />

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <input 
                type="file" 
                id="hero-upload" 
                style={{ display: "none" }} 
                accept="video/*,image/*" 
                onChange={handleHeroFileUpload} 
              />
              <label 
                htmlFor="hero-upload" 
                style={{ flexGrow: 1, textAlign: "center", padding: "12px", background: T.bg, border: `1px dashed ${T.cream}`, borderRadius: "8px", cursor: "pointer", fontFamily: ff.b, fontSize: "11px", letterSpacing: "1px" }}
              >
                {savingHero ? "Uploading media..." : "↑ Upload New Video/Image"}
              </label>
            </div>

            <button 
              onClick={saveHero} 
              disabled={savingHero}
              style={{ width: "100%", padding: "12px 24px", background: T.wine, color: T.paper, border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: ff.b, fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px" }}
            >
              {savingHero ? "Processing..." : "Save Hero Settings"}
            </button>
          </div>

          <div style={{ background: T.ink, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
             {hero.url ? (
               hero.type === "video" ? (
                 <video src={hero.url} autoPlay muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
               ) : (
                 <img src={hero.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
               )
             ) : (
               <p style={{ color: T.paper, fontFamily: ff.b, fontSize: "12px" }}>Preview</p>
             )}
          </div>
        </div>
      </section>

      {/* ── Partner Logos ── */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: ff.h, fontSize: "20px", color: T.wine }}>Brand Marquee Strip</h2>
          <p style={{ fontSize: "12px", color: T.muted }}>85 official logos integrated. Add or disable brands below.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
          {partners.map((p) => (
            <div key={p.id} style={{ 
              background: T.bg, 
              padding: "16px", 
              borderRadius: "12px", 
              border: `1px solid ${T.cream}`, 
              opacity: p.active ? 1 : 0.4,
              transition: "all 0.3s",
              position: "relative"
            }}>
              <img src={p.logo_url} style={{ width: "100%", height: "40px", objectFit: "contain", marginBottom: "12px" }} />
              <p style={{ fontSize: "10px", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
                <button 
                  onClick={() => togglePartner(p.id, p.active)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                  title={p.active ? "Disable" : "Enable"}
                >
                  {p.active ? "✅" : "❌"}
                </button>
                <button 
                  onClick={() => deletePartner(p.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          
          <input 
            type="file" 
            id="logo-upload" 
            style={{ display: "none" }} 
            accept="image/*" 
            onChange={handleAddBrand} 
          />
          <label 
            htmlFor="logo-upload" 
            style={{ 
              border: `2px dashed ${T.cream}`, 
              borderRadius: "12px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              padding: "20px",
              background: "none",
              cursor: "pointer",
              color: T.muted
            }}
          >
            <span style={{ fontSize: "24px", marginBottom: "8px" }}>{uploadingLogo ? "◌" : "+"}</span>
            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
              {uploadingLogo ? "Uploading..." : "Add Brand"}
            </span>
          </label>
        </div>
      </section>
    </div>
  );
}
