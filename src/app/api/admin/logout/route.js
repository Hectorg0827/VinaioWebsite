import { NextResponse } from "next/server";
import { cookies }      from "next/headers";

export async function GET(req) {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "admin_auth", path: "/admin" });
  // Use req.url so the redirect stays on the same origin — no open-redirect risk
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
