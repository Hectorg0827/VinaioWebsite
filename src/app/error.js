"use client";

import { useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        height: "100vh",
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 48px",
      }}
    >
      <Hr w="32px" c={T.red} style={{ margin: "0 auto 24px" }} />
      <h1
        style={{
          fontFamily: ff.h,
          fontSize: "48px",
          color: T.ink,
          marginBottom: "16px",
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontFamily: ff.b,
          fontSize: "14px",
          color: T.muted,
          maxWidth: "400px",
          margin: "0 auto 40px",
          lineHeight: 1.8,
        }}
      >
        We encountered an unexpected error while retrieving this page. 
        Please try again or return to our home page.
      </p>
      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={() => reset()}
          style={{
            fontFamily: ff.b,
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 600,
            color: T.ink,
            background: T.cream,
            border: `1px solid ${T.taupe}`,
            padding: "16px 36px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            fontFamily: ff.b,
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 500,
            color: T.paper,
            background: T.wine,
            border: `1px solid ${T.wine}`,
            padding: "16px 36px",
            cursor: "pointer",
          }}
        >
          Go Home
        </button>
      </div>
    </main>
  );
}
