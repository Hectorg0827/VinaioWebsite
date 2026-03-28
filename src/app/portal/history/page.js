import { getUser } from "@/lib/supabase/safe";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const { user, supabase } = await getUser();

  let orders = [];
  if (supabase && user) {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(qty, unit_price, products(name))")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });
    orders = data ?? [];
  }

  return <HistoryClient orders={orders} />;
}
