"use client";

import React from "react";
import { T, ff } from "@/lib/theme";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Sentry Plumbing (will only fire if NEXT_PUBLIC_SENTRY_DSN is set)
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "120px 48px",
          textAlign: "center",
          background: T.bg,
          color: T.ink,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <h2 style={{ fontFamily: ff.h, fontSize: "32px", marginBottom: "16px" }}>Something went wrong.</h2>
          <p style={{ fontFamily: ff.b, fontSize: "16px", color: T.muted, maxWidth: "500px", marginBottom: "32px", lineHeight: 1.6 }}>
            Our team has been notified. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "14px 32px",
              background: T.wine,
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontFamily: ff.b,
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
