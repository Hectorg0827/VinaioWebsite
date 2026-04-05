import { getUser } from "@/lib/supabase/safe";
import PortalApp   from "./PortalApp";

export default async function PortalPage() {
  const { user, supabase } = await getUser();

  let customer = null, orders = [], products = [], licenses = [], catalogs = [];

  if (supabase && user) {
    const [c, ord, prod, lic, cat] = await Promise.all([
      supabase.from("customers").select("*").eq("id", user.id).single(),
      supabase
        .from("orders")
        .select("*, order_items(qty, unit_price, product_id, products(name, sku))")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .order("featured", { ascending: false }),
      supabase.from("licenses").select("*").eq("customer_id", user.id),
      supabase.from("site_catalogs").select("*").order("created_at", { ascending: false }),
    ]);

    // Normalize customer to PortalApp shape
    if (c.data) {
      customer = {
        name:          c.data.company        ?? "Your Account",
        contact:       user.email?.split("@")[0] ?? "User",
        email:         user.email             ?? "",
        accountNumber: c.data.account_number  ?? "—",
        rep:           c.data.rep_name        ?? "Vinaio Team",
        repEmail:      c.data.rep_email       ?? "orders@vinaioimports.com",
        creditLimit:   c.data.credit_limit    ?? 0,
        currentAR:     c.data.balance         ?? 0,
        overdueAR:     0,  // computed from live invoices on demand
        daysOverdue:   0,
        ytdPurchases:  0,
        address:       "",
      };
    }

    // Normalize orders
    if (ord.data?.length) {
      orders = ord.data.map((o) => ({
        id:     o.id,
        date:   new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        items:  (o.order_items ?? []).map((li) => ({
          name: li.products?.name ?? "Product",
          qty:  li.qty,
        })),
        total:  o.total  ?? 0,
        status: o.status ?? "Processing",
      }));
    }

    // Normalize product catalogue for order page
    if (prod.data?.length) {
      products = prod.data.map((p) => ({
        id:          p.id,
        sku:         p.product_code  ?? p.sku ?? "",
        name:        p.name,
        brand:       p.brand         ?? p.origin ?? "",
        category:    (p.categories ?? [])[0] ?? p.category ?? "Other",
        price:       p.price_bottle  ?? p.price ?? 0,
        btlPerCase:  p.case_qty      ?? 12,
        trend:       "Steady",
        tags:        p.tags          ?? [],
        description: p.description_en ?? p.description ?? "",
        imageUrl:    p.image_url     ?? null,
        portfolios:  p.portfolios    ?? [],
      }));
    }

    licenses = lic.data ?? [];
    catalogs = cat.data ?? [];

    // Log portal visit for analytics (fire-and-forget)
    supabase.from("portal_logs").insert([{
      customer_id: user.id,
      action:      "portal_visit",
      details:     { page: "dashboard", user_email: user.email },
    }]).then(() => {});
  }

  return (
    <PortalApp
      customer={customer}
      orders={orders}
      products={products}
      licenses={licenses}
      catalogs={catalogs}
      user={user}
    />
  );
}
