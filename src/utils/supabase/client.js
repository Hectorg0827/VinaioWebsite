import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. Returning recursive mock client for build safety.");
    const mock = new Proxy(() => mock, {
      get: (target, prop) => {
        if (prop === "then") return (resolve) => resolve({ data: [], error: null, count: 0 });
        return mock;
      },
      apply: () => mock
    });
    return mock;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
