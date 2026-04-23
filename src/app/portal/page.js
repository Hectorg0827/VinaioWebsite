import { getUser } from "@/lib/supabase/safe";
import DashboardClient from "./DashboardClient";

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

    // Handle Pending Status
    if (c.data && c.data.status !== "active") {
      return (
        <div style={{ padding: "120px 48px", textAlign: "center", background: "white", borderRadius: "12px", border: "1px solid #eee" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>Account Pending Approval</h2>
          <p style={{ maxWidth: "500px", margin: "0 auto", lineHeight: 1.6, color: "#666" }}>
            Your account request for <strong>{c.data.company}</strong> is currently under review 
            by our compliance team. We manually verify all wholesale accounts to ensure 
            pricing integrity. You will be notified via email once your portal access is active.
          </p>
        </div>
      );
    }

    // Normalize customer and keep both legacy/new keys consumed by portal components
    if (c.data) {
      customer = {
        // legacy keys used in DashboardClient
        company:       c.data.company        ?? "Your Account",
        account_number:c.data.account_number ?? "—",
        credit_limit:  c.data.credit_limit   ?? 0,
        balance:       c.data.balance        ?? 0,
        // newer aliases used by other portal surfaces
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
        id:          o.id,
        created_at:  o.created_at,
        order_items: o.order_items ?? [],
        date:        new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        items:       (o.order_items ?? []).map((li) => ({
          name: li.products?.name ?? "Product",
          qty:  li.qty,
        })),
        total:       o.total  ?? 0,
        status:      o.status ?? "Processing",
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
    <DashboardClient
      customer={customer}
      orders={orders}
      products={products}
      licenses={licenses}
      catalogs={catalogs}
      user={user}
      invoices={[]}
    />
  );
}
