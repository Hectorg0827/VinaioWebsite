import { getUser } from "@/lib/supabase/safe";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const { user, supabase } = await getUser();

  let customer = null;
  if (supabase && user) {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("id", user.id)
      .single();
    customer = data;
  }

  return <AccountClient customer={customer} user={user} />;
}
