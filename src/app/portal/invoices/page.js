import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InvoicesClient from "./InvoicesClient";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return <InvoicesClient invoices={invoices ?? []} />;
}
