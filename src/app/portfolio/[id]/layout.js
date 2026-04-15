import { createClient } from "@supabase/supabase-js";

const BASE = "https://www.vinaioimports.com";

async function getProduct(id) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data } = await supabase
      .from("products")
      .select("name, brand, summary, description_en, image_url, slug")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await getProduct(id);

  if (!p) {
    return {
      title: "Product | Vinaio Imports",
      description: "Explore our curated selection of fine wines and spirits.",
    };
  }

  const title = `${p.brand} ${p.name} | Vinaio Imports`;
  const description =
    p.summary ||
    p.description_en ||
    `Discover ${p.brand} ${p.name} — a premium selection imported by Vinaio Imports.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE}/portfolio/${p.slug || id}`,
      siteName: "Vinaio Imports",
      images: p.image_url ? [{ url: p.image_url, width: 900, height: 900 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.image_url ? [p.image_url] : [],
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
