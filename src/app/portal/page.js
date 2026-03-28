import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function PortalDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  // Fetch customer profile
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch recent invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(count)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch expiring licenses
  const { data: licenses } = await supabase
    .from("licenses")
    .select("*")
    .eq("customer_id", user.id);

  return (
    <DashboardClient
      customer={customer}
      invoices={invoices ?? []}
      orders={orders ?? []}
      licenses={licenses ?? []}
      user={user}
    />
  );
}
