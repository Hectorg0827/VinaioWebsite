import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PortalShell from "./PortalShell";

export const metadata = {
  title: "Customer Portal — Vinaio Imports",
};

export default async function PortalLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // login page renders its own full-screen layout without the shell
  return (
    <PortalShell user={user}>
      {children}
    </PortalShell>
  );
}
