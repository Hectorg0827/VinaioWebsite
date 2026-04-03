import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// PUT /api/admin/products/[id] — update a product
export async function PUT(req, { params }) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  const { id } = await params;
  const body = await req.json();
  const { 
    name, sku, brand, producer, vintage, format, case_qty, type, category, categories, 
    origin, region, description_en, description_es, summary,
    portfolios, inStock, featured, imageUrl, logoUrl, tags 
  } = body;

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .update({
        name,
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
        in_stock:       inStock,
        featured,
        image_url:      imageUrl       ?? null,
        logo_url:       logoUrl        ?? null,
        tags:           tags           ?? [],
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: { ...data, inStock: data.in_stock } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — delete a product
export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  const { id } = await params;

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
