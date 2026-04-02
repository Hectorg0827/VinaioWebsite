export default function sitemap() {
  const baseUrl = "https://www.vinaioimports.com";

  // Essential static routes
  const routes = ["", "/portfolio", "/services", "/spain", "/contact", "/portal", "/portal/login"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "" ? 1 : 0.8,
    })
  );

  return routes;
}
