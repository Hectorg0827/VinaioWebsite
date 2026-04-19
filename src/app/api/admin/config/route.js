import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// GET /api/admin/config — Fetch global settings (or specific by key)
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") || "branding";
    const isPublic = key === "branding";

    const cookieStore = await cookies();
    if (!isPublic && !(await isAdminAuthenticated(cookieStore))) return unauthorized();
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("key", key)
      .single();

    if (error && error.code !== "PGRST116") throw error; // Allow empty
    return NextResponse.json({ config: data || { key, value: {} } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/config — Upsert global settings
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) return unauthorized();

  try {
    const body = await req.json(); // { key, value }
    if (!body.key) throw new Error("Missing config key");

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("site_config")
      .upsert({ 
        key: body.key, 
        value: body.value, 
        updated_at: new Date() 
      }, { onConflict: 'key' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ config: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
