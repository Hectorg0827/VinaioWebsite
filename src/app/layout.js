import { T } from "@/lib/theme";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";
import AgeGate from "@/components/AgeGate";
import { Suspense } from "react";

export const metadata = {
  title: "Vinaio Imports | Premium Spirits, Wines & Beers Distributor",
  description:
    "New York's premier beverage alcohol importer and distributor. Specializing in authentic Dominican rums, craft spirits, and exclusive international wine portfolios.",
  metadataBase: new URL("https://www.vinaioimports.com"),
  keywords: [
    "wine importer", "spirits distributor", "beverage alcohol", "white label wine",
    "Dominican Republic rum", "Spanish wine importer", "TTB licensed", "compliance solutions",
    "logistics partner", "New York wine distributor", "New Jersey spirits",
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        <Suspense fallback={null}>
          <Analytics />
          <PageTransition />
          <AgeGate />
        </Suspense>
        <Nav />
        <ErrorBoundary>
          <div style={{ minHeight: "calc(100vh - 80px)" }}>{children}</div>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
