/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy
// - script-src: 'unsafe-inline' needed for Next.js hydration chunks
// - style-src:  'unsafe-inline' needed for React inline style props + Google Fonts stylesheet
// - connect-src: allows Supabase + Resend API calls from the browser
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com ${isDev ? "http://localhost:* ws://localhost:*" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // Prevent browsers from MIME-sniffing the content type
  { key: "X-Content-Type-Options",     value: "nosniff" },
  // Block the page from being embedded in iframes (clickjacking)
  { key: "X-Frame-Options",            value: "DENY" },
  // Controls how much referrer info is sent
  { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
  // Restrict access to powerful browser APIs
  { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Content Security Policy
  { key: "Content-Security-Policy",    value: CSP },
  // Force HTTPS for 1 year (only effective in production over HTTPS)
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },

  async headers() {
    return [
      // Apply security headers to all routes
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Portal: also block search engine indexing
      {
        source: "/portal/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      // Admin: also block search engine indexing + extra frame protection
      {
        source: "/admin/(.*)",
        headers: [
          { key: "X-Robots-Tag",    value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control",   value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
