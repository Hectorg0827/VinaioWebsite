import re

with open("src/app/services/page.js", "r") as f:
    text = f.read()

# I want to add import for DistributionMap at the top
if 'import DistributionMap' not in text:
    text = text.replace('import Hr from "@/components/Hr";', 'import Hr from "@/components/Hr";\nimport DistributionMap from "@/components/DistributionMap";')

# Replace the old distribution map segment
start_marker = "{/* ── Distribution Map Segment ────────────────────────────────────── */}"
end_marker = "{/* ── Process ─────────────────────────────────────────────────────── */}"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_segment = """{/* ── Distribution Map Segment ────────────────────────────────────── */}
      <section style={{
        background: T.metal,
        padding: "100px 48px 120px",
        color: T.ink,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <p style={{ fontFamily: ff.b, fontSize: "11px", letterSpacing: "5px", color: T.gold, marginBottom: "16px", textTransform: "uppercase" }}>Network</p>
              <h2 style={{ fontFamily: ff.h, fontSize: "40px" }}>Our Market Footprint</h2>
              <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "600px", margin: "16px auto 0" }}>
                Hover over the map to view our distribution networks across the United States. 
              </p>
            </div>
            
            {/* Split layout: US Map on left, European origins on right */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "center" }}>
              
              <div style={{ flex: "1 1 600px" }}>
                <DistributionMap />
              </div>

              <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ background: T.paper, padding: "40px", borderRadius: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: `1px solid ${T.cream}` }}>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "20px" }}>Direct Distribution</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, lineHeight: 1.6, marginBottom: "16px" }}>
                    We operate with our own sales forces and logistics infrastructure directly in the key markets.
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ background: T.wine, color: T.paper, padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontFamily: ff.b, fontWeight: "bold" }}>New York</span>
                    <span style={{ background: T.wine, color: T.paper, padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontFamily: ff.b, fontWeight: "bold" }}>New Jersey</span>
                    <span style={{ background: T.wine, color: T.paper, padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontFamily: ff.b, fontWeight: "bold" }}>Florida</span>
                  </div>
                </div>

                <div style={{ background: T.paper, padding: "40px", borderRadius: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: `1px solid ${T.cream}` }}>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.ink, marginBottom: "20px" }}>Partner Network</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.muted, lineHeight: 1.6, marginBottom: "16px" }}>
                    We distribute nationally to key partners spanning the entire US, from California to Massachusetts, ensuring wide accessibility and coverage.
                  </p>
                  <div style={{ display: "inline-block", paddingBottom: "2px", borderBottom: `2px solid ${T.gold}` }}>
                    <span style={{ color: T.gold, fontFamily: ff.b, fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>26+ States Covered</span>
                  </div>
                </div>

                <div style={{ background: T.charcoal, padding: "40px", borderRadius: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, fontSize: "120px", opacity: 0.05, pointerEvents: "none" }}>🇪🇺</div>
                  <h3 style={{ fontFamily: ff.h, fontSize: "24px", color: T.paper, marginBottom: "20px" }}>European Origins</h3>
                  <p style={{ fontFamily: ff.b, fontSize: "15px", color: T.cream, lineHeight: 1.6, marginBottom: "20px" }}>
                    Our sourcing teams and quality control operate exactly where our products are born.
                  </p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: "6px" }}>
                      <span style={{ fontSize: "18px" }}>🇪🇸</span>
                      <span style={{ color: T.paper, fontFamily: ff.b, fontSize: "14px", fontWeight: "bold" }}>Spain</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: "6px" }}>
                      <span style={{ fontSize: "18px" }}>🇮🇹</span>
                      <span style={{ color: T.paper, fontFamily: ff.b, fontSize: "14px", fontWeight: "bold" }}>Italy</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      """
    
    text = text[:start_idx] + new_segment + text[end_idx:]
    
    with open("src/app/services/page.js", "w") as f:
        f.write(text)
    print("Replaced Distribution segment successfully!")
else:
    print("Could not find markers.")
