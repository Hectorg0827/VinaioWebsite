import { getUser } from "@/lib/supabase/safe";
import LicensesClient from "./LicensesClient";

export default async function LicensesPage() {
  const { user, supabase } = await getUser();

  let licenses = [];
  if (supabase && user) {
    const { data } = await supabase
      .from("licenses")
      .select("*")
      .eq("customer_id", user.id)
      .order("expiry", { ascending: true });
    licenses = data ?? [];
  }

  return <LicensesClient licenses={licenses} />;
}
