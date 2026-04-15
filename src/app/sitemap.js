import { createClient } from "@supabase/supabase-js";

export default async function sitemap() {
  const baseUrl = "https://www.vinaioimports.com";

  // Static routes
  const routes = [
    "",
    "/about",
    "/portfolio",
    "/services",
    "/contact",
    "/privacy",
    "/terms",
    "/portal",
    "/portal/login",
    "/portal/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic product routes from Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at, created_at");

    const productRoutes = (products || []).map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: new Date(p.updated_at || p.created_at || new Date()),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch {
    return routes;
  }
}
