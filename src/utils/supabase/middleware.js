import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const updateSession = async (request) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing in middleware. Returning mock client for build safety.");
    const mock = new Proxy(() => mock, {
      get: (target, prop) => {
        if (prop === "then") return (resolve) => resolve({ data: { user: null }, error: null });
        if (prop === "auth") return { getUser: () => Promise.resolve({ data: { user: null }, error: null }) };
        return mock;
      },
      apply: () => mock
    });
    // This will refresh session if expired - necessary for Server Components
    // to read the correct session
    await mock.auth.getUser();
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  // This will refresh session if expired - necessary for Server Components
  // to read the correct session
  await supabase.auth.getUser();

  return supabaseResponse;
};
