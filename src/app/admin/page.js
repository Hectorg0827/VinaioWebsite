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

  try {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });
    if (data?.length) {
      products = data.map((p) => ({
        ...p,
        inStock: p.in_stock,
        imageUrl: p.image_url,
        categories: p.categories ?? (p.category ? [p.category] : []),
      }));
    }
  } catch {
    // Supabase not configured — use seed data
  }

  return <AdminDashboard initialProducts={products} />;
}
