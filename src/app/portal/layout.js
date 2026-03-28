import { createClient } from "@/lib/supabase/server";
import PortalShell from "./PortalShell";

export const metadata = {
  title: "Customer Portal — Vinaio Imports",
};

export default async function PortalLayout({ children }) {
  // Gracefully handle missing Supabase config (e.g. during local dev without .env.local)
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // Supabase not configured — portal pages will show demo/mock data
  }

  return (
    <PortalShell user={user}>
      {children}
    </PortalShell>
  );
}
