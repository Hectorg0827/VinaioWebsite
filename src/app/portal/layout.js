import { createClient } from "@/lib/supabase/server";
import { redirect }     from "next/navigation";

export const metadata = {
  title:  "Customer Portal — Vinaio Imports",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }) {
  // Defence-in-depth auth check (middleware is the primary guard)
  // Auth check is primarily handled by middleware. 
  // We allow layout to render so the PortalWelcome can be shown on /portal.
  // Internal subpages are protected by middleware redirecting to /portal/login.

  return <>{children}</>;
}
