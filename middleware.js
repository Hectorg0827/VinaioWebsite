import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  // 1. Handle missing environment variables during build/prerender
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  // 2. Use the updateSession helper to refresh the cookie
  let supabaseResponse = await updateSession(request);
  
  // 3. Create a separate client for the auth protection check
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // Fail silently in case of auth errors during build/edge cases
  }

  // 4. Portal and Admin Route Protection
  const pathname = request.nextUrl.pathname;
  const isPortalRoute = pathname.startsWith("/portal");
  const isLoginRoute = pathname === "/portal/login" || pathname === "/portal/register" || pathname === "/portal/reset-password";
  const isPortalHome = pathname === "/portal" || pathname === "/portal/";

  // Redirect to login if user tries to access internal portal sub-pages without being logged in
  if (isPortalRoute && !isLoginRoute && !isPortalHome && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/register pages
  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
