import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("site_team")
    .select("*")
    .order("order", { ascending: true })
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const supabase = await createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("site_team")
    .insert([{
      name: body.name,
      role: body.role,
      desc: body.desc,
      level: body.level,
      photo_url: body.photo_url,
      order: body.order || 0,
      active: body.active ?? true,
    }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
