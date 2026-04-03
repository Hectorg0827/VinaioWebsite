"use client";

import { useState, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function AdminMediaManager() {
  const [hero, setHero] = useState({ 
    url: "", // fallback/legacy
    images: ["", "", ""], // Hero 2.0
    title: "", 
    subtitle: "From the sun-drenched vineyards of Rioja to the rolling hills of Tuscany, the volcanic slopes of Nepal to the Caribbean shores of the Dominican Republic — Vinaio Imports brings the world's most compelling wines, spirits, and craft beverages to the American table. Based in New York and distributing across the United States, we partner directly with family estates and artisan producers in over 15 countries, curating a portfolio of more than 500 labels that tell a story in every bottle.", 
    type: "image" 
  });
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
      if (dataHero.hero) {
        let urls = [];
        try {
          urls = JSON.parse(dataHero.hero.url);
        } catch (e) {
          urls = dataHero.hero.url?.split("|").filter(Boolean) || [];
        }
        setHero({ 
          ...dataHero.hero, 
          images: urls.length >= 3 ? urls : [...urls, "", "", ""].slice(0, 3) 
        });
      }

      const resPart = await fetch("/api/admin/partners");
      const dataPart = await resPart.json();
      if (dataPart.partners) setPartners(dataPart.partners);
    } catch (err) {
      console.error("Fetch media error:", err);
    }
  };

  const saveHero = async () => {
    setSavingHero(true);
    // Combine images back into one field for the legacy schema
    const dataToSave = {
      ...hero,
      url: JSON.stringify(hero.images.filter(u => u.trim() !== "")),
      active: true
    };

    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Hero configuration synchronized!" });
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to sync hero settings." });
    }
    setSavingHero(false);
  };

  const handleHeroImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSavingHero(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "hero");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.publicUrl) {
        const newImages = [...hero.images];
        newImages[index] = data.publicUrl;
        setHero({ ...hero, images: newImages });
        setMsg({ type: "success", text: `Hero Image ${index + 1} uploaded!` });
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
          headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
    background: T.paper, padding: "32px", borderRadius: "16px", border: `1px solid ${T.cream}`, marginBottom: "40px"
  };

  const inputStyle = {
    width: "100%", padding: "12px", background: T.bg, border: `1px solid ${T.cream}`,
    borderRadius: "8px", fontFamily: ff.b, fontSize: "14px", color: T.ink, outline: "none", marginBottom: "16px"
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
      <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "40px" }}>Media & Branding</h1>

      {msg && (
        <div style={{ padding: "16px", background: msg.type === "success" ? T.wineGlow : "#fee2e2", color: msg.type === "success" ? T.wine : "#b91c1c", borderRadius: "8px", marginBottom: "24px", fontSize: "13px", fontWeight: 600 }}>
          {msg.text}
        </div>
      )}

      {/* ── Hero Management ── */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
           <div>
             <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "8px" }}>Dynamic Hero Console</h2>
             <p style={{ fontSize: "13px", color: T.muted }}>Manage the "alive" 3-image carousel and mission statement text.</p>
           </div>
           <button onClick={saveHero} disabled={savingHero} style={{ padding: "12px 32px", background: T.wine, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>
             {savingHero ? "Syncing..." : "Sync Hero to Site"}
           </button>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>
          <div>
            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "12px" }}>Global Hero Narrative</label>
            <textarea 
              value={hero.subtitle} 
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} 
              style={{ ...inputStyle, height: "180px", resize: "none" }}
              placeholder="Vinaio Imports brings the world's most compelling wines..."
            />

            <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, display: "block", marginBottom: "16px" }}>Background Slide Sequence</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {[0, 1, 2].map(i => (
                <div key={i}>
                  <div style={{ width: "100%", height: "120px", background: T.bg, borderRadius: "8px", border: `1px dashed ${T.cream}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", overflow: "hidden" }}>
                    {hero.images?.[i] ? <img src={hero.images[i]} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "10px", color: T.muted }}>Slot {i+1}</span>}
                  </div>
                  <input type="file" id={`hero-${i}`} style={{ display: "none" }} accept="image/*" onChange={(e) => handleHeroImageUpload(e, i)} />
                  <label htmlFor={`hero-${i}`} style={{ display: "block", textAlign: "center", padding: "8px", background: T.taupe, borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}>
                    {savingHero ? "..." : "Upload Slide"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.ink, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
             <p style={{ color: T.gold, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>Live Preview Simulation</p>
             <div style={{ flexGrow: 1, position: "relative", background: "#000", borderRadius: "12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {hero.images?.[0] && <img src={hero.images[0]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />}
                <div style={{ position: "relative", zIndex: 2, padding: "20px", textAlign: "center" }}>
                   <img src="/logo.png" style={{ height: "20px", marginBottom: "12px" }} />
                   <div style={{ fontSize: "12px", color: "white", fontFamily: ff.h, lineHeight: 1.4 }}>{hero.subtitle?.substring(0, 80)}...</div>
                </div>
             </div>
             <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontStyle: "italic" }}>The production site uses Ken Burns scale-animations for an "alive" feel.</p>
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
