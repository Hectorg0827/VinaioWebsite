import { getUser } from "@/lib/supabase/safe";
import DashboardClient from "./DashboardClient";

export default async function PortalDashboardPage() {
  const { user, supabase } = await getUser();

  let customer = null, invoices = [], orders = [], licenses = [], catalogs = [];

  if (supabase && user) {
    const [c, inv, ord, lic, cat] = await Promise.all([
      supabase.from("customers").select("*").eq("id", user.id).single(),
      supabase.from("invoices").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("orders").select("*, order_items(count)").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("licenses").select("*").eq("customer_id", user.id),
      supabase.from("site_catalogs").select("*").eq("active", true).order("created_at", { ascending: false }),
    ]);

    customer = c.data;
    invoices = inv.data ?? [];
    orders   = ord.data ?? [];
    licenses = lic.data ?? [];
    catalogs = cat.data ?? [];

    // Log Activity for Analytics
    await supabase.from("portal_logs").insert([{
      customer_id: user.id,
      action: "login",
      details: { page: "dashboard", user_email: user.email }
    }]);
  }

  return (
    <DashboardClient
      customer={customer}
      invoices={invoices}
      orders={orders}
      licenses={licenses}
      catalogs={catalogs}
      user={user}
    />
  );
}
