import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// POST /api/admin/products — create a new product
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  const body = await req.json();
  const { 
    name, sku, brand, producer, vintage, format, case_qty, type, category, categories, 
    origin, region, description_en, description_es, summary,
    portfolios, inStock, featured, imageUrl, logoUrl, tags 
  } = body;

  const slug = body.slug || `${name}-${sku}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  if (!name || (!sku && !body.product_code)) {
    return NextResponse.json({ error: "name and sku are required" }, { status: 400 });
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        product_code:   body.product_code || sku,
        brand:          brand          || null,
        producer:       producer       || null,
        vintage:        vintage        || null,
        format:         format         || null,
        case_qty:       parseInt(case_qty) || null,
        type:           type           || null,
        category:       category       || categories?.[0] || null,
        categories:     categories     ?? [],
        origin:         origin         || "",
        region:         region         || "",
        summary:        summary        || null,
        description_en: description_en || null,
        description_es: description_es || null,
        portfolios:     portfolios     ?? [],
        in_stock:       inStock        ?? true,
        featured:       featured       ?? false,
        image_url:      imageUrl       ?? null,
        logo_url:       logoUrl        ?? null,
        tags:           tags           ?? [],
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: { ...data, inStock: data.in_stock } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
