import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// GET /api/admin/partners — Fetch all partner logos
export async function GET() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("site_partners")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ partners: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/partners — Add a new partner
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const body = await req.json();
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("site_partners")
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ partner: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/partners — Toggle active state or update order
export async function PATCH(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const body = await req.json(); // { id, active, order }
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("site_partners")
      .update(body)
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ partner: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/partners — Remove a partner logo
export async function DELETE(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const supabase = await createAdminClient();
    const { error } = await supabase.from("site_partners").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
