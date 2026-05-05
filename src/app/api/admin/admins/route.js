import { NextResponse } from "next/server";
import { cookies }      from "next/headers";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/admin/userAuth";

/**
 * GET /api/admin/admins
 * List all admin users.
 */
export async function GET() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("site_admins")
      .select("id, username, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ admins: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/admins
 * Create a new admin user.
 */
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const passwordHash = hashPassword(password);

    const { data, error } = await supabase
      .from("site_admins")
      .insert([{ username, password_hash: passwordHash }])
      .select("id, username, created_at")
      .single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Username already exists" }, { status: 409 });
      throw error;
    }

    return NextResponse.json({ admin: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/admins
 * Delete an admin user.
 */
export async function DELETE(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const supabase = await createAdminClient();
    const { error } = await supabase.from("site_admins").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
