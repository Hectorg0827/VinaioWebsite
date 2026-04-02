import { updateSession } from "@/utils/supabase/middleware";
import { createClient }   from "@/utils/supabase/middleware"; // Assuming it was exported, but I'll use the server client for auth check

export async function middleware(request) {
  // Use the updateSession helper to refresh the cookie
  let supabaseResponse = await updateSession(request);
  
  // Create a separate client for the auth protection check
  // (Standard practice is to get the user from the client that was used in updateSession)
  // But since updateSession returns the response, we need to re-initialize a client 
  // or modify updateSession to return both.
  
  // For simplicity and following the project's current logic, I'll just keep the user check here.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
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
    return supabaseResponse;
  }

  // Protect all /portal routes except /portal/login
  const isPortalRoute = request.nextUrl.pathname.startsWith("/portal");
  const isLoginRoute = request.nextUrl.pathname === "/portal/login";

  if (isPortalRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login page
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
