import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LicensesClient from "./LicensesClient";

export default async function LicensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: licenses } = await supabase
    .from("licenses")
    .select("*")
    .eq("customer_id", user.id)
    .order("expiry", { ascending: true });

  return <LicensesClient licenses={licenses ?? []} />;
}
