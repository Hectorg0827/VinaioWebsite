import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(qty, unit_price, products(name))")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return <HistoryClient orders={orders ?? []} />;
}
