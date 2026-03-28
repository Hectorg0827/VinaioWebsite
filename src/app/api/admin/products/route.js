import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createClient }        from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// POST /api/admin/products — create a new product
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  const body = await req.json();
  const { name, sku, price, unit, categories, origin, region, inStock, featured, description, tags, imageUrl } = body;

  if (!name || !sku) {
    return NextResponse.json({ error: "name and sku are required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        sku,
        price:       parseFloat(price) || 0,
        unit:        unit || "750ml",
        categories:  categories ?? [],
        origin:      origin || "",
        region:      region || "",
        in_stock:    inStock ?? true,
        featured:    featured ?? false,
        description: description || "",
        tags:        tags ?? [],
        image_url:   imageUrl ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: { ...data, inStock: data.in_stock } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
