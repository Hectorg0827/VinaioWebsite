export default function sitemap() {
  const baseUrl = "https://www.vinaioimports.com";

  // Essential static routes
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
    "/portal/register"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
