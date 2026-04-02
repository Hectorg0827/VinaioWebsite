import Link from "next/link";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function NotFound() {
  return (
    <main
      style={{
        height: "100vh",
        background: T.ink,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 48px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 80% at 50% 50%, ${T.wineDeep}35 0%, transparent 60%)`,
        }}
      />
      <div style={{ position: "relative" }}>
        <Hr w="32px" c={T.gold} style={{ margin: "0 auto 24px" }} />
        <h1
          style={{
            fontFamily: ff.h,
            fontSize: "clamp(64px, 12vw, 120px)",
            color: T.paper,
            marginBottom: "16px",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontFamily: ff.b,
            fontSize: "14px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: T.gold,
            marginBottom: "40px",
          }}
        >
          Page Not Found
        </p>
        <p
          style={{
            fontFamily: ff.b,
            fontSize: "15px",
            color: "rgba(255,255,255,0.45)",
            maxWidth: "400px",
            margin: "0 auto 48px",
            lineHeight: 1.8,
          }}
        >
          The resource you are looking for has been moved or no longer exists. 
          Return to our portfolio to explore our curated selections.
        </p>
        <Link
          href="/portfolio"
          style={{
            fontFamily: ff.b,
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 600,
            color: T.paper,
            border: `1px solid rgba(255,255,255,0.25)`,
            padding: "16px 40px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Return to Portfolio
        </Link>
      </div>
    </main>
  );
}
