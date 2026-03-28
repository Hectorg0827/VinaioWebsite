import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createClient }        from "@/lib/supabase/server";
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
  const { name, sku, price, unit, categories, origin, region, inStock, featured, description, tags, imageUrl } = body;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        sku,
        price:       parseFloat(price) || 0,
        unit,
        categories:  categories ?? [],
        origin,
        region,
        in_stock:    inStock,
        featured,
        description,
        tags:        tags ?? [],
        image_url:   imageUrl ?? null,
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
    const supabase = await createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
