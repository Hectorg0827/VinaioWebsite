import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";

export const metadata = {
  title:  "Customer Portal — Vinaio Imports",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }) {
  // Defence-in-depth auth check (middleware is the primary guard)
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const isLoginPage = false; // layout doesn't know the exact path; middleware handles redirect
    if (!data?.user) {
      // Only redirect if Supabase is actually configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) redirect("/portal/login");
    }
  } catch {
    // Supabase not configured — allow render with mock data
  }

  return <>{children}</>;
}
