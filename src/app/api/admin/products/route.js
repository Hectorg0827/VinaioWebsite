import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "true";
}

// POST /api/admin/products — create a new product
export async function POST(req) {
  if (!(await checkAuth())) return unauthorized();

  const body = await req.json();
  const { name, sku, price, unit, categories, origin, region, inStock, featured, description, tags } = body;

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
        price: parseFloat(price) || 0,
        unit: unit || "750ml",
        categories: categories ?? [],
        origin: origin || "",
        region: region || "",
        in_stock: inStock ?? true,
        featured: featured ?? false,
        description: description || "",
        tags: tags ?? [],
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: { ...data, inStock: data.in_stock } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
