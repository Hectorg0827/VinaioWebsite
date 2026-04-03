import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await req.json();
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Payload must be an array of products" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const formattedProducts = products.map((p) => {
      // Basic Slug Generation
      const slugBase = `${p.brand || p.producer || "product"}-${p.name}-${p.sku || Math.random().toString(36).substring(7)}`;
      const slug = slugBase.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .substring(0, 100);

      // Category parsing
      let cats = [];
      if (typeof p.categories === "string") {
        try {
          cats = JSON.parse(p.categories);
        } catch (e) {
          cats = p.categories.split(",").map(c => c.trim());
        }
      } else if (Array.isArray(p.categories)) {
        cats = p.categories;
      }

      return {
        name:           p.name,
        slug:           slug,
        product_code:   p.sku || null,
        brand:          p.brand || null,
        producer:       p.producer || null,
        vintage:        p.vintage || null,
        format:         p.format || null,
        case_qty:       parseInt(p.case_qty) || null,
        type:           p.type || null,
        category:       cats[0] || null,
        categories:     cats,
        origin:         p.origin || "",
        region:         p.region || "",
        summary:        p.summary || null,
        description_en: p.description_en || null,
        portfolios:     ["all"],
        in_stock:       true,
        featured:       false,
        image_url:      p.image_url || null,
        logo_url:       p.logo_url || null,
        tags:           [],
      };
    });

    // Supabase upsert (by product_code/slug if unique)
    // For bulk migrating, we'll try to insert. 
    // Note: If you want to overwrite, use upsert({ onConflict: 'product_code' })
    const { data, error } = await supabase
      .from("products")
      .upsert(formattedProducts, { onConflict: "product_code" });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      count: formattedProducts.length,
      message: `Successfully imported ${formattedProducts.length} products.`
    });

  } catch (error) {
    console.error("Bulk Import Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
