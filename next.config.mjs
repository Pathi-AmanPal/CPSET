/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent embedding in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Don't send Referer header when navigating away
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 2 years
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Block access to sensitive browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Prevent search-engine caching / archiving of private pages
  { key: "X-Robots-Tag", value: "noarchive, nosnippet" },
  // NOTE: Content-Security-Policy is set authoritatively in middleware.ts
  // to avoid conflicts with next.config.mjs headers. Do not add it here.
  // NOTE: X-XSS-Protection is intentionally omitted — it is deprecated and
  // can introduce XSS vulnerabilities in older IE. A strong CSP replaces it.
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        // Google Charts API — used to render TOTP QR codes in the admin settings page
        protocol: "https",
        hostname: "chart.googleapis.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Additionally prevent direct image hotlinking / caching
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, noarchive" },
          // Disallow cross-origin embedding of images on other sites
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
        ],
      },
    ];
  },
};

export default nextConfig;
