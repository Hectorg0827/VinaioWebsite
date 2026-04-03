import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// GET /api/admin/catalogs — Fetch all PDF catalogs
export async function GET() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("site_catalogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ catalogs: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/catalogs — Add a new catalog
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const body = await req.json();
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("site_catalogs")
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ catalog: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/catalogs — Remove a catalog
export async function DELETE(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const supabase = await createAdminClient();
    const { error } = await supabase.from("site_catalogs").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
