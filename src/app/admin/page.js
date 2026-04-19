import { cookies }             from "next/headers";
import { redirect }            from "next/navigation";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { PRODUCTS }            from "@/data/products";
import AdminDashboard          from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) redirect("/admin/login");

  // Load products from Supabase if available, else use seed data
  let products = PRODUCTS.map((p) => ({
    ...p,
    categories: p.categories ?? [p.category],
  }));

  let isLive = false;
  try {
    const supabase = await createAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });
      
      if (data?.length && !error) {
        products = data.map((p) => ({
          ...p,
          inStock: p.in_stock,
          imageUrl: p.image_url,
          categories: p.categories ?? (p.category ? [p.category] : []),
        }));
        isLive = true;
      }
    }
  } catch (err) {
    console.error("Admin products fetch error:", err);
  }

  return <AdminDashboard initialProducts={products} isLive={isLive} />;
}
