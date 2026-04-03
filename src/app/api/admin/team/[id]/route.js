import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const body = await req.json();

  const { error } = await supabase
    .from("site_team")
    .update({
      name: body.name,
      role: body.role,
      desc: body.desc,
      level: body.level,
      photo_url: body.photo_url,
      order: body.order,
      active: body.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("site_team")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
