import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// GET /api/admin/hero — Fetch active hero settings
export async function GET() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("site_hero")
      .select("*")
      .eq("active", true)
      .single();

    if (error && error.code !== "PGRST116") throw error; // Allow empty
    return NextResponse.json({ hero: data || { url: "", title: "", subtitle: "", type: "video" } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/hero — Upsert hero settings
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const body = await req.json();
    const supabase = await createAdminClient();

    // 1. Find the current active row ID if it exists
    const { data: existing } = await supabase
      .from("site_hero")
      .select("id")
      .eq("active", true)
      .limit(1)
      .single();

    // 2. Upsert using that ID or a new one
    const { data, error } = await supabase
      .from("site_hero")
      .upsert({ 
        ...body, 
        id: existing?.id, // If it exists, overwrite it
        active: true, 
        updated_at: new Date() 
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ hero: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
