import { T } from "@/lib/theme";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Vinaio Imports | Premium Spirits, Wines & Beers Distributor",
  description:
    "New York's premier beverage alcohol importer and distributor. Specializing in authentic Dominican rums, craft spirits, and exclusive international wine portfolios.",
  keywords: [
    "wine importer", "spirits distributor", "beverage alcohol", "white label wine",
    "Dominican Republic rum", "Spanish wine importer", "TTB licensed", "Park Street alternative",
    "MHW alternative", "New York wine distributor", "New Jersey spirits",
  ],
  openGraph: {
    title: "Vinaio Imports",
    description: "Full-service beverage alcohol importer & distributor.",
    url: "https://www.vinaioimports.com",
    siteName: "Vinaio Imports",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "Vinaio Imports - Fine Wine & Spirits",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinaio Imports",
    description: "Full-service beverage alcohol importer & distributor.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { background: ${T.bg}; color: ${T.ink}; }
          ::selection { background: ${T.wineGlow}; color: ${T.wine}; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: ${T.bg}; }
          ::-webkit-scrollbar-thumb { background: ${T.taupe}; border-radius: 3px; }
          a { text-decoration: none; }
          button { cursor: pointer; }
        `}</style>
      </head>
      <body>
        <Nav />
        <div style={{ minHeight: "calc(100vh - 80px)" }}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
