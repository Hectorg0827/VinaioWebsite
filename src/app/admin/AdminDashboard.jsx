"use client";

import { useState } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { ALL_CATEGORIES } from "@/data/products";

const REGIONS = ["Caribbean", "South America", "Europe", "North America", "Asia", "Other"];
const UNITS   = ["750ml", "1L", "1.75L", "375ml", "355ml", "330ml", "500ml", "Other"];

const EMPTY_FORM = {
  name: "", sku: "", price: "", unit: "750ml",
  categories: [], origin: "", region: "Caribbean",
  inStock: true, featured: false, description: "",
  imageUrl: "",
};

export default function AdminDashboard({ initialProducts }) {
  const [products, setProducts]   = useState(initialProducts);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null); // null = add mode, id = edit mode
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState(null); // { type: 'success'|'error', text }
  const [search, setSearch]       = useState("");
  const [deleting, setDeleting]   = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleCategory = (cat) =>
    set("categories", form.categories.includes(cat)
      ? form.categories.filter((c) => c !== cat)
      : [...form.categories, cat]
    );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setMsg(null);
  };

  const openEdit = (product) => {
    setForm({
      name:        product.name        ?? "",
      sku:         product.sku         ?? "",
      price:       product.price       ?? "",
      unit:        product.unit        ?? "750ml",
      categories:  product.categories  ?? [],
      origin:      product.origin      ?? "",
      region:      product.region      ?? "Caribbean",
      inStock:     product.inStock     ?? product.in_stock ?? true,
      featured:    product.featured    ?? false,
      description: product.description ?? "",
      imageUrl:    product.imageUrl    ?? product.image_url ?? "",
    });
    setEditingId(product.id ?? product.slug);
    setShowForm(true);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setMsg(null);
  };

  const save = async () => {
    if (!form.name.trim())               return setMsg({ type: "error", text: "Product name is required." });
    if (!form.price || isNaN(form.price)) return setMsg({ type: "error", text: "Enter a valid price." });
    if (form.categories.length === 0)    return setMsg({ type: "error", text: "Select at least one category." });

    setSaving(true);
    setMsg(null);

    const payload = {
      ...form,
      price:    parseFloat(form.price),
      inStock:  form.inStock,
      imageUrl: form.imageUrl.trim() || null,
      id:       editingId,
    };

    const res = await fetch(
      editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
      {
        method:  editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (res.ok) {
      if (editingId) {
        setProducts((prev) =>
          prev.map((p) => (p.id ?? p.slug) === editingId ? { ...p, ...payload } : p)
        );
        setMsg({ type: "success", text: `"${form.name}" updated successfully.` });
      } else {
        setProducts((prev) => [...prev, { ...payload, id: data.id ?? Date.now().toString() }]);
        setMsg({ type: "success", text: `"${form.name}" added to the catalog.` });
        setForm(EMPTY_FORM);
      }
      setEditingId(null);
      setShowForm(false);
    } else {
      setMsg({ type: "error", text: data.error ?? "Something went wrong. Please try again." });
    }

    setSaving(false);
  };

  const deleteProduct = async (product) => {
    if (!confirm(`Remove "${product.name}" from the catalog? This cannot be undone.`)) return;
    setDeleting(product.id ?? product.slug);
    const res = await fetch(`/api/admin/products/${product.id ?? product.slug}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => (p.id ?? p.slug) !== (product.id ?? product.slug)));
    }
    setDeleting(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.origin?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: T.bg, border: `1px solid ${T.cream}`,
    borderRadius: "6px", fontFamily: ff.b, fontSize: "14px",
    color: T.ink, outline: "none", boxSizing: "border-box",
  };
  const labelStyle = {
    fontFamily: ff.b, fontSize: "9px", letterSpacing: "2.5px",
    textTransform: "uppercase", color: T.warm, display: "block", marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingTop: "80px" }}>

      {/* ── Top Bar ── */}
      <div style={{ background: T.ink, padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: "80px", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: ff.h, fontSize: "20px", color: T.paper, letterSpacing: "4px", textTransform: "uppercase" }}>Vinaio</span>
          <span style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: T.warm }}>· Admin · Product Catalog</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a href="/portfolio" target="_blank" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm }}>
            View Portfolio ↗
          </a>
          <button
            onClick={openAdd}
            style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, color: T.paper, background: T.wine, border: "none", borderRadius: "6px", padding: "10px 20px", cursor: "pointer" }}
          >
            + Add Product
          </button>
          <a href="/api/admin/logout" style={{ fontFamily: ff.b, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm }}>
            Sign Out
          </a>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 48px" }}>

        {/* ── Global message ── */}
        {msg && (
          <div style={{ padding: "14px 20px", background: msg.type === "success" ? T.greenLight : T.redLight, border: `1px solid ${msg.type === "success" ? T.green : T.red}30`, borderRadius: "8px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: ff.b, fontSize: "13px", color: msg.type === "success" ? T.green : T.red }}>{msg.type === "success" ? "✓" : "⚠"} {msg.text}</span>
            <button onClick={() => setMsg(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: "16px" }}>×</button>
          </div>
        )}

        {/* ── Add / Edit Form ── */}
        {showForm && (
          <div style={{ background: T.paper, border: `2px solid ${T.wine}30`, borderRadius: "12px", padding: "40px", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <Hr w="24px" c={T.wine} style={{ marginBottom: "12px" }} />
                <h2 style={{ fontFamily: ff.h, fontSize: "26px", color: T.ink }}>
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
              </div>
              <button onClick={cancelForm} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: ff.b, fontSize: "12px", color: T.muted }}>
                Cancel ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

              {/* Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Product Name *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} style={{ ...inputStyle, fontSize: "16px" }} placeholder="e.g. Casa Nova Tempranillo" />
              </div>

              {/* SKU + Price */}
              <div>
                <label style={labelStyle}>SKU / Item Code</label>
                <input value={form.sku} onChange={(e) => set("sku", e.target.value)} style={inputStyle} placeholder="e.g. CNT-750" />
              </div>
              <div>
                <label style={labelStyle}>Wholesale Price (USD) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} style={inputStyle} placeholder="12.99" />
              </div>

              {/* Unit + Origin */}
              <div>
                <label style={labelStyle}>Bottle / Can Size</label>
                <select value={form.unit} onChange={(e) => set("unit", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Country of Origin</label>
                <input value={form.origin} onChange={(e) => set("origin", e.target.value)} style={inputStyle} placeholder="e.g. Spain" />
              </div>

              {/* Region */}
              <div>
                <label style={labelStyle}>Region</label>
                <select value={form.region} onChange={(e) => set("region", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                  {REGIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Categories — multi-select checkboxes */}
              <div>
                <label style={labelStyle}>Categories * (select all that apply)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                  {ALL_CATEGORIES.map((cat) => {
                    const selected = form.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        style={{
                          fontFamily: ff.b, fontSize: "11px", letterSpacing: "1px",
                          textTransform: "uppercase", fontWeight: selected ? 600 : 400,
                          color:      selected ? T.paper : T.muted,
                          background: selected ? T.wine  : T.cream,
                          border:     selected ? `1px solid ${T.wine}` : `1px solid ${T.taupe}`,
                          padding: "7px 14px", borderRadius: "20px", cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {selected ? "✓ " : ""}{cat}
                      </button>
                    );
                  })}
                </div>
                {form.categories.length === 0 && (
                  <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.orange, marginTop: "6px" }}>
                    Please select at least one category.
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Product Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => set("imageUrl", e.target.value)}
                  style={inputStyle}
                  placeholder="https://... (optional — paste a direct image link)"
                />
                {form.imageUrl && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", border: `1px solid ${T.cream}` }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <span style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted }}>Image preview</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Product Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                  placeholder="1–2 sentences describing the product — tasting notes, style, occasion..."
                />
              </div>

              {/* Toggles */}
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "32px" }}>
                <Toggle
                  label="Available to Order"
                  hint="Turn off if the product is out of stock"
                  value={form.inStock}
                  onChange={(v) => set("inStock", v)}
                  onColor={T.green}
                />
                <Toggle
                  label="Featured on Portfolio"
                  hint="Shown in the 'Featured Selections' section"
                  value={form.featured}
                  onChange={(v) => set("featured", v)}
                  onColor={T.gold}
                />
              </div>
            </div>

            {/* Save button */}
            <div style={{ marginTop: "32px", display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  fontFamily: ff.b, fontSize: "11px", letterSpacing: "2.5px",
                  textTransform: "uppercase", fontWeight: 600,
                  color: T.paper, background: saving ? T.muted : T.wine,
                  border: "none", borderRadius: "6px",
                  padding: "14px 36px", cursor: saving ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Add to Catalog"}
              </button>
              <button onClick={cancelForm} style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted, background: "none", border: "none", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Product List ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.ink }}>Product Catalog</h2>
            <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, marginTop: "2px" }}>
              {products.length} product{products.length !== 1 ? "s" : ""} · click a row to edit
            </p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, origin or SKU…"
            style={{ padding: "10px 16px", background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "6px", fontFamily: ff.b, fontSize: "13px", color: T.ink, outline: "none", width: "280px" }}
          />
        </div>

        {/* Table */}
        <div style={{ background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "10px", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr 80px 80px 80px", padding: "12px 20px", background: T.cream, gap: "12px" }}>
            {["Product", "Origin", "Price", "Categories", "Stock", "Featured", ""].map((h) => (
              <span key={h} style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.muted, fontWeight: 600 }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", fontFamily: ff.b, fontSize: "14px", color: T.muted }}>
              {search ? `No products match "${search}"` : "No products yet — click Add Product to get started."}
            </div>
          )}

          {filtered.map((p, i) => (
            <div
              key={p.id ?? p.slug ?? i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1.5fr 80px 80px 80px",
                padding: "16px 20px",
                gap: "12px",
                borderBottom: i < filtered.length - 1 ? `1px solid ${T.cream}` : "none",
                alignItems: "center",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => openEdit(p)}
            >
              {/* Name + SKU */}
              <div>
                <p style={{ fontFamily: ff.b, fontSize: "14px", fontWeight: 600, color: T.ink }}>{p.name}</p>
                <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted }}>{p.sku} · {p.unit}</p>
              </div>

              {/* Origin */}
              <span style={{ fontFamily: ff.b, fontSize: "12px", color: T.deep }}>{p.origin}</span>

              {/* Price */}
              <span style={{ fontFamily: ff.h, fontSize: "16px", color: T.wine }}>${parseFloat(p.price).toFixed(2)}</span>

              {/* Categories */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {(p.categories ?? []).map((c) => (
                  <span key={c} style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: T.wine, background: T.wineGlow, padding: "3px 8px", borderRadius: "3px" }}>
                    {c}
                  </span>
                ))}
              </div>

              {/* Stock */}
              <span style={{ fontFamily: ff.b, fontSize: "11px", color: p.inStock ? T.green : T.red, fontWeight: 600 }}>
                {p.inStock ? "✓ Yes" : "✕ No"}
              </span>

              {/* Featured */}
              <span style={{ fontFamily: ff.b, fontSize: "11px", color: p.featured ? T.gold : T.taupe, fontWeight: 600 }}>
                {p.featured ? "★ Yes" : "—"}
              </span>

              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); deleteProduct(p); }}
                disabled={deleting === (p.id ?? p.slug)}
                style={{ fontFamily: ff.b, fontSize: "11px", color: T.red, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", opacity: deleting === (p.id ?? p.slug) ? 0.4 : 1 }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Help box */}
        <div style={{ marginTop: "32px", padding: "24px 28px", background: T.cream, borderRadius: "10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          {[
            { icon: "＋", title: "Add a product",    text: 'Click "Add Product" at the top right, fill in the details, and save. It appears on the public Portfolio and the order catalog immediately.' },
            { icon: "✎", title: "Edit a product",    text: 'Click anywhere on a product row to open the edit form. Change any field and click "Save Changes".' },
            { icon: "◉", title: "Hide vs. delete",   text: 'Toggle "Available to Order" off to show the product as out of stock without removing it. Use Delete only to remove it permanently.' },
          ].map((h) => (
            <div key={h.title}>
              <p style={{ fontFamily: ff.b, fontSize: "13px", fontWeight: 600, color: T.ink, marginBottom: "6px" }}>{h.icon} {h.title}</p>
              <p style={{ fontFamily: ff.b, fontSize: "12px", color: T.muted, lineHeight: 1.7 }}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ label, hint, value, onChange, onColor }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: "44px", height: "24px", borderRadius: "12px", border: "none",
          background: value ? onColor : T.taupe, cursor: "pointer",
          position: "relative", transition: "background 0.25s", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: "3px",
          left: value ? "23px" : "3px",
          width: "18px", height: "18px", borderRadius: "50%",
          background: T.paper, transition: "left 0.25s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
      <div>
        <p style={{ fontFamily: ff.b, fontSize: "13px", fontWeight: 600, color: T.ink }}>{label}</p>
        <p style={{ fontFamily: ff.b, fontSize: "11px", color: T.muted }}>{hint}</p>
      </div>
    </div>
  );
}
