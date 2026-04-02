"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { T, ff } from "@/lib/theme";

const LOGOS = [
  "brand-1.png", "brand-2.jpg", "brand-3.svg", "brand-4.png", "brand-5.png",
  "brand-6.png", "brand-7.png", "brand-8.png", "brand-9.png", "brand-10.png",
  "brand-11.png", "brand-12.svg", "brand-13.png", "brand-14.png", "brand-15.png",
  "brand-16.png", "brand-17.png", "brand-18.png", "brand-19.png", "brand-20.png",
  "brand-21.png", "brand-22.png", "brand-23.png", "brand-24.svg", "brand-25.png",
  "brand-26.png", "brand-27.png", "brand-28.jpg", "brand-29.png", "brand-30.png",
  "brand-31.jpg", "brand-32.png", "brand-33.png", "brand-34.jpg", "brand-35.png",
  "brand-36.png", "brand-37.png", "brand-38.png", "brand-39.png", "brand-40.png",
  "brand-41.png", "brand-42.png", "brand-43.png", "brand-44.png", "brand-45.png",
  "brand-46.png", "brand-47.png", "brand-48.webp", "brand-49.png", "brand-50.svg",
  "brand-51.jpg", "brand-52.jpg", "brand-53.png", "brand-54.png", "brand-55.png",
  "brand-56.png", "brand-57.png", "brand-58.png", "brand-59.svg", "brand-60.png",
  "brand-61.svg", "brand-62.png", "brand-63.png", "brand-64.png", "brand-65.png",
  "brand-66.png", "brand-67.jpg", "brand-68.jpg", "brand-69.png", "brand-70.png",
  "brand-71.png", "brand-72.jpg", "brand-73.svg", "brand-74.png", "brand-75.png",
  "brand-76.png", "brand-77.png", "brand-78.png", "brand-79.jpg", "brand-80.png",
  "brand-81.jpg", "brand-82.png", "brand-83.png", "brand-84.jpg"
];

export default function MigrateLogosPage() {
  const supabase = createClient();
  const [status, setStatus] = useState("Ready");
  const [progress, setProgress] = useState(0);

  const startMigration = async () => {
    setStatus("Migrating...");
    for (let i = 0; i < LOGOS.length; i++) {
        const logo = LOGOS[i];
        const name = logo.split(".")[0].replace("brand-", "Brand ");
        const url = `/logos/${logo}`; // Point to the local /public/logos/ first
        
        // We insert into DB pointing to local assets
        // This is a "Partial Migration" to make the marquee dynamic immediately
        // The admin can later replace them with real cloud uploads via the Media Manager
        const { error } = await supabase.from("site_partners").upsert([
            { name, logo_url: url, active: true, order: i }
        ], { onConflict: "name" });

        if (error) console.error("Error migrating", logo, error);
        setProgress(Math.round(((i + 1) / LOGOS.length) * 100));
    }
    setStatus("Complete!");
  };

  return (
    <div style={{ padding: "80px", background: T.bg, minHeight: "100vh" }}>
      <h1 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink }}>Partner Logo Migration</h1>
      <p style={{ color: T.muted, marginBottom: "40px" }}>This will populate the <code>site_partners</code> table with the 84 brands currently in <code>/public/logos</code>.</p>
      
      <div style={{ background: T.paper, padding: "40px", borderRadius: "12px", border: `1px solid ${T.cream}` }}>
        <p style={{ marginBottom: "20px", fontWeight: 600 }}>Status: {status}</p>
        <div style={{ width: "100%", height: "8px", background: T.bg, borderRadius: "4px", marginBottom: "32px", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: T.wine, transition: "width 0.3s" }} />
        </div>
        
        <button 
           onClick={startMigration}
           disabled={status !== "Ready"}
           style={{ padding: "12px 32px", background: T.wine, color: T.paper, border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
            Run Migration
        </button>
      </div>
    </div>
  );
}
