"use client";

import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { T, ff } from "@/lib/theme";

/**
 * SmartLink resolves a string mention (Product Name or Brand) to a URL.
 * It prioritizes Product Profile pages (/portfolio/[id]) over search results.
 */
export default function SmartLink({ text, children, style = {} }) {
  if (!text) return children;

  const normalized = text.toLowerCase().trim();
  
  // 1. Try to find an exact match in the static products list (fallback/seed)
  let targetUrl = `/portfolio?search=${encodeURIComponent(text)}`;
  
  const match = PRODUCTS.find(p => 
    p.name.toLowerCase() === normalized || 
    p.id.toLowerCase() === normalized ||
    p.brand?.toLowerCase() === normalized
  );

  if (match) {
    targetUrl = `/portfolio/${match.id}`;
  } else {
    // 2. Specialized common mapping for brands/slugs we know exist in Supabase
    // This handles the "Directly to Profile" requirement where static data might be missing.
    const COMMON_MAP = {
      "cepa 21": "cepa-21",
      "babylonstoren": "babylonstoren",
      "altos de torona": "altos-de-torona",
      "campos reales": "campos-reales",
      "la fuerza": "la-fuerza",
      "vino piña": "vino-pina",
      "barrica 29": "barrica-29",
      "viña maipo": "vina-maipo",
      "italo cescon": "italo-cescon",
      "cantine leuci": "cantine-leuci",
      "monte tondo": "monte-tondo",
      "château des deux rives": "chateau-des-deux-rives"
    };

    if (COMMON_MAP[normalized]) {
      targetUrl = `/portfolio/${COMMON_MAP[normalized]}`;
    }
  }

  return (
    <Link 
      href={targetUrl}
      style={{
        color: "inherit",
        textDecoration: "none",
        borderBottom: `1px solid transparent`,
        transition: "all 0.3s ease",
        cursor: "pointer",
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottomColor = T.wine;
        e.currentTarget.style.color = T.wine;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottomColor = "transparent";
        e.currentTarget.style.color = "inherit";
      }}
    >
      {children || text}
    </Link>
  );
}
