import { getUser } from "@/lib/supabase/safe";
import DashboardClient from "./DashboardClient";

export default async function PortalDashboardPage() {
  const { user, supabase } = await getUser();

  let customer = null, invoices = [], orders = [], licenses = [];

  if (supabase && user) {
    const [c, inv, ord, lic] = await Promise.all([
      supabase.from("customers").select("*").eq("id", user.id).single(),
      supabase.from("invoices").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("orders").select("*, order_items(count)").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("licenses").select("*").eq("customer_id", user.id),
    ]);
    customer = c.data;
    invoices = inv.data ?? [];
    orders   = ord.data ?? [];
    licenses = lic.data ?? [];
  }

  return (
    <DashboardClient
      customer={customer}
      invoices={invoices}
      orders={orders}
      licenses={licenses}
      user={user}
    />
  );
}
