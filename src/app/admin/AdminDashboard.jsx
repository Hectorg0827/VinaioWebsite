"use client";

import { useState } from "react";
import { T, ff } from "@/lib/theme";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMediaManager from "@/components/AdminMediaManager";
import AdminCatalogManager from "@/components/AdminCatalogManager";
import AdminAnalytics from "@/components/AdminAnalytics";
import Hr from "@/components/Hr";
import { ALL_CATEGORIES, ORIGINS } from "@/data/products";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";

const REGIONS = ["Caribbean", "South America", "Europe", "North America", "Asia", "Other"];
const UNITS   = ["750ml", "1L", "1.75L", "375ml", "355ml", "330ml", "500ml", "Other"];

const PORTFOLIOS = [
  { id: "all",               label: "All Products" },
  { id: "elite",             label: "Vinaio Elite" },
  { id: "caribbean",         label: "Vinaio Caribbean" },
  { id: "beer_low_alc",      label: "Beer & Low Alcohol" },
  { id: "kosher",            label: "Kosher" },
  { id: "intl_wines_spirits", label: "International Wines & Spirits" },
];

const EMPTY_FORM = {
  name: "", sku: "", product_code: "", brand: "", vintage: "", format: "", type: "",
  category: "", categories: [], origin: "", region: "Caribbean",
  inStock: true, featured: false, description_en: "", description_es: "",
  price_case: "", price_bottle: "", tier_pricing: [],
  portfolios: ["all"],
  imageUrl: "",
  logoUrl: "",
};

export default function AdminDashboard({ initialProducts }) {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts]   = useState(initialProducts);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState(null);
  const [search, setSearch]       = useState("");
  const [deleting, setDeleting]   = useState(null);
  const supabase = createClient();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleCategory = (cat) =>
    set("categories", form.categories.includes(cat)
      ? form.categories.filter((c) => c !== cat)
      : [...form.categories, cat]
    );

  const togglePortfolio = (portId) =>
    set("portfolios", form.portfolios.includes(portId)
      ? form.portfolios.filter((id) => id !== portId)
      : [...form.portfolios, portId]
    );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setMsg(null);
  };

  const openEdit = (product) => {
    setForm({
      name:           product.name           ?? "",
      sku:            product.sku            ?? "",
      product_code:   product.product_code   ?? "",
      brand:          product.brand          ?? "",
      vintage:        product.vintage        ?? "",
      format:         product.format         ?? "",
      type:           product.type           ?? "",
      category:       product.category       ?? "",
      categories:     product.categories     ?? [],
      origin:         product.origin         ?? "",
      region:         product.region         ?? "Caribbean",
      inStock:        product.in_stock       ?? product.inStock ?? true,
      featured:       product.featured       ?? false,
      description_en: product.description_en ?? product.description ?? "",
      description_es: product.description_es ?? "",
      price_case:     product.price_case     ?? "",
      price_bottle:   product.price_bottle   ?? "",
      tier_pricing:   product.tier_pricing   ?? [],
      portfolios:     product.portfolios     ?? ["all"],
      imageUrl:       product.image_url      ?? product.imageUrl ?? "",
      logoUrl:        product.logo_url       ?? product.logoUrl  ?? "",
    });
    setEditingId(product.id ?? product.slug);
    setShowForm(true);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const publicUrl = await uploadFile(file, "products");
    if (publicUrl) {
      set("imageUrl", publicUrl);
      setMsg({ type: "success", text: "Bottle image uploaded!" });
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const publicUrl = await uploadFile(file, "logos");
    if (publicUrl) {
      set("logoUrl", publicUrl);
      setMsg({ type: "success", text: "Brand logo uploaded!" });
    }
    setSaving(false);
  };

  const saveProduct = async () => {
    if (!form.name.trim()) return setMsg({ type: "error", text: "Name required." });
    
    setSaving(true);
    const res = await fetch(editingId && isUUID(editingId) ? `/api/admin/products/${editingId}` : "/api/admin/products", {
      method: editingId && isUUID(editingId) ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: isUUID(editingId) ? editingId : undefined }),
    });

    if (res.ok) {
       setMsg({ type: "success", text: "Product successfully synchronized with database!" });
       setShowForm(false);
       // Refresh list after brief delay
       setTimeout(() => window.location.reload(), 1000);
    } else {
       let errorMsg = "Failed to save.";
       try {
         const err = await res.json();
         errorMsg = err.error || errorMsg;
       } catch (e) {
         console.error("Non-JSON error response", e);
       }
       setMsg({ type: "error", text: errorMsg });
    }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Permanently delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
  };

  const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const renderProducts = () => (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <Hr w="40px" c={T.wine} style={{ marginBottom: "20px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Portfolio Management</h1>
        </div>
        <button onClick={openAdd} style={{ padding: "12px 24px", background: T.wine, color: T.paper, border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <div style={{ background: T.paper, padding: "40px", borderRadius: "16px", border: `2px solid ${T.wine}20`, marginBottom: "40px" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
             <h2 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink }}>{editingId ? "Edit Catalog Item" : "New Portfolio Addition"}</h2>
             <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
           </div>
           
           <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Brand / Producer</label>
                      <input value={form.brand} onChange={e => set("brand", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="e.g. Aljibes" />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Product Name</label>
                      <input value={form.name} onChange={e => set("name", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="e.g. Petit Verdot" />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Vintage</label>
                      <input value={form.vintage} onChange={e => set("vintage", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="2021" />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Format</label>
                      <input value={form.format} onChange={e => set("format", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="750ml x 12" />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>SKU / QB ID</label>
                      <input value={form.sku} onChange={e => set("sku", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="ALJ-PV" />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Type / D.O.</label>
                      <input value={form.type} onChange={e => set("type", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="Vino de la Tierra" />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Case Price ($)</label>
                      <input value={form.price_case} onChange={e => set("price_case", e.target.value)} type="number" step="0.01" style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="0.00" />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Bottle Price ($)</label>
                      <input value={form.price_bottle} onChange={e => set("price_bottle", e.target.value)} type="number" step="0.01" style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="0.00" />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Origin Country</label>
                      <input value={form.origin} onChange={e => set("origin", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }} placeholder="Spain" />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Region</label>
                      <select value={form.region} onChange={e => set("region", e.target.value)} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px" }}>
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Portfolio Membership</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {PORTFOLIOS.map(port => (
                        <button 
                          key={port.id} 
                          onClick={() => togglePortfolio(port.id)}
                          style={{
                            padding: "8px 16px", borderRadius: "12px", fontSize: "11px", border: `1px solid ${form.portfolios.includes(port.id) ? T.gold : T.cream}`,
                            background: form.portfolios.includes(port.id) ? T.gold : "none",
                            color: form.portfolios.includes(port.id) ? T.ink : T.muted,
                            cursor: "pointer", transition: "all 0.3s"
                          }}
                        >
                          {form.portfolios.includes(port.id) && "✓ "} {port.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Categories</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {ALL_CATEGORIES.map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => toggleCategory(cat)}
                          style={{
                            padding: "8px 16px", borderRadius: "20px", fontSize: "11px", border: `1px solid ${form.categories.includes(cat) ? T.wine : T.cream}`,
                            background: form.categories.includes(cat) ? T.wine : "none",
                            color: form.categories.includes(cat) ? T.paper : T.muted,
                            cursor: "pointer", transition: "all 0.3s"
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Description (EN)</label>
                      <textarea value={form.description_en} onChange={e => set("description_en", e.target.value)} rows={4} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px", resize: "none" }} placeholder="English tasting notes..." />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Description (ES)</label>
                      <textarea value={form.description_es} onChange={e => set("description_es", e.target.value)} rows={4} style={{ width: "100%", padding: "12px", border: `1px solid ${T.cream}`, borderRadius: "8px", resize: "none" }} placeholder="Notas de cata en español..." />
                    </div>
                  </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ padding: "20px", background: T.bg, borderRadius: "12px", border: `1px solid ${T.cream}` }}>
                    <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, color: T.muted, marginBottom: "12px" }}>Product Assets</p>
                    
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ fontSize: "10px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Brand Logo</label>
                      <div style={{ height: "80px", background: "white", borderRadius: "8px", border: `1px dashed ${T.cream}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "8px" }}>
                        {form.logoUrl ? <img src={form.logoUrl} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: "10px", color: T.muted }}>No Logo</span>}
                      </div>
                      <input type="file" id="logo-img" style={{ display: "none" }} accept="image/*" onChange={handleLogoUpload} />
                      <label htmlFor="logo-img" style={{ display: "block", textAlign: "center", padding: "8px", background: T.taupe, borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}>{saving ? "..." : "Upload Logo"}</label>
                    </div>

                    <div>
                      <label style={{ fontSize: "10px", fontWeight: 600, display: "block", marginBottom: "8px" }}>Bottle Image (Full)</label>
                      <div style={{ height: "180px", background: "white", borderRadius: "8px", border: `1px dashed ${T.cream}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "8px" }}>
                        {form.imageUrl ? <img src={form.imageUrl} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: "10px", color: T.muted }}>No Bottle Image</span>}
                      </div>
                      <input type="file" id="prod-img" style={{ display: "none" }} accept="image/*" onChange={handleProductImageUpload} />
                      <label htmlFor="prod-img" style={{ display: "block", textAlign: "center", padding: "8px", background: T.taupe, borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}>{saving ? "..." : "Upload Bottle"}</label>
                    </div>
                  </div>

                 <div style={{ background: T.bg, padding: "20px", borderRadius: "12px", border: `1px solid ${T.cream}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>In Stock</span>
                      <input type="checkbox" checked={form.inStock} onChange={e => set("inStock", e.target.checked)} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>Featured Selection</span>
                      <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} />
                    </div>
                 </div>

                 {form.tier_pricing?.length > 0 && (
                   <div style={{ padding: "16px", background: T.wineGlow, borderRadius: "12px", border: `1px solid ${T.wine}20` }}>
                      <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, color: T.wine, marginBottom: "10px" }}>Volume Tiers Active</p>
                      {form.tier_pricing.map((t, idx) => (
                        <div key={idx} style={{ fontSize: "11px", color: T.deep, marginBottom: "4px" }}>
                          {t.min_cs}+ Cs: ${t.case_price} / cs
                        </div>
                      ))}
                   </div>
                 )}

                 <button onClick={saveProduct} disabled={saving} style={{ marginTop: "auto", padding: "16px", background: T.wine, color: T.paper, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>
                    {saving ? "Processing..." : "Sync to Portfolio"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Product List View */}
      <div style={{ background: T.paper, borderRadius: "12px", border: `1px solid ${T.cream}`, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ padding: "20px", borderBottom: `1px solid ${T.cream}`, background: T.bg }}>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search by brand, product name, or SKU..." 
            style={{ width: "100%", padding: "12px 16px", border: `1px solid ${T.cream}`, borderRadius: "8px", outline: "none", fontSize: "14px" }}
          />
        </div>
        {products.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) || 
          (p.brand || "").toLowerCase().includes(search.toLowerCase()) || 
          (p.sku || p.product_code || "").toLowerCase().includes(search.toLowerCase())
        ).map((p, i) => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "80px 3.5fr 1fr 1.5fr 100px", padding: "16px 20px", borderBottom: `1px solid ${T.cream}`, alignItems: "center", transition: "background 0.2s" }}>
            <div style={{ width: "56px", height: "56px", background: T.bg, borderRadius: "6px", overflow: "hidden", border: `1px solid ${T.cream}` }}>
              {p.image_url || p.imageUrl ? <img src={p.image_url || p.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
            </div>
            <div>
              <span style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: T.muted }}>{p.brand}</span>
              <span style={{ fontFamily: ff.b, fontSize: "15px", fontWeight: 600, color: T.ink, display: "block" }}>{p.name} {p.vintage}</span>
              <span style={{ fontSize: "11px", color: T.muted }}>{p.product_code || p.sku} · {p.format}</span>
            </div>
            <span style={{ fontSize: "12px", color: T.muted }}>{p.categories?.join(", ")}</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
               <span style={{ fontFamily: ff.h, color: T.wine, fontSize: "16px" }}>${(p.price_case || 0).toFixed(2)} <span style={{ fontSize: "10px", color: T.muted }}>/ cs</span></span>
               <span style={{ fontSize: "11px", color: T.muted }}>${(p.price_bottle || 0).toFixed(2)} / btl</span>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>✏️</button>
              <button onClick={() => deleteProduct(p.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main style={{ marginLeft: "280px", width: "calc(100% - 280px)", padding: "80px 60px" }}>
        {activeTab === "products" && renderProducts()}
        {activeTab === "media" && <AdminMediaManager />}
        {activeTab === "catalogs" && <AdminCatalogManager />}
        {activeTab === "analytics" && <AdminAnalytics />}
      </main>

      {/* ── Global Header Overlay ── */}
      <div style={{ 
        position: "fixed", top: 0, left: 0, right: 0, height: "80px", 
        background: T.ink, zIndex: 100, display: "flex", 
        justifyContent: "space-between", alignItems: "center", padding: "0 48px" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontFamily: ff.h, color: T.paper, fontSize: "20px", letterSpacing: "4px" }}>Vinaio</span>
          <span style={{ height: "20px", width: "1px", background: `${T.paper}30` }} />
          <span style={{ fontFamily: ff.b, color: T.warm, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase" }}>Admin Console</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ fontFamily: ff.b, color: T.warm, fontSize: "11px" }}>Welcome, Admin</span>
          <a href="/api/admin/logout" style={{ fontFamily: ff.b, color: T.wineGlow, fontSize: "11px", textDecoration: "none", fontWeight: 600 }}>Logout →</a>
        </div>
      </div>
    </div>
  );
}
