import { T } from "@/lib/theme";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Vinaio Imports — Fine Wine & Spirits Importer & Distributor",
  description:
    "Vinaio Imports is a full-service beverage alcohol importer and distributor. Self-distribution in NY, NJ & FL. 26-state network. White label, logistics, compliance, and exclusive US importer for Spain & European brands.",
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
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Sora:wght@300;400;500;600;700&display=swap"
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
        {children}
      </body>
    </html>
  );
}
