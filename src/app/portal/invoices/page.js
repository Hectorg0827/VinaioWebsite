import { getUser } from "@/lib/supabase/safe";
import InvoicesClient from "./InvoicesClient";

export default async function InvoicesPage() {
  const { user, supabase } = await getUser();

  let invoices = [];
  if (supabase && user) {
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });
    invoices = data ?? [];
  }

  return <InvoicesClient invoices={invoices} />;
}
