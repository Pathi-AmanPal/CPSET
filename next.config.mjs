/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent embedding in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Legacy XSS filter for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
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
  // Content Security Policy — restrict sources
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + inline (needed for Next.js hydration) + vercel analytics
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-insights.com",
      // Styles: self + inline (needed for Tailwind/CSS-in-JS)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: self + blob (Next.js image optimization) + vercel storage
      "img-src 'self' blob: data: https://*.public.blob.vercel-storage.com",
      // Connections: self + vercel analytics + raw github for geojson map data
      "connect-src 'self' https://vercel.live https://*.vercel-insights.com https://raw.githubusercontent.com",
      // No plugins/embeds
      "object-src 'none'",
      // Base URL locked to self
      "base-uri 'self'",
      // Forms only post to self
      "form-action 'self'",
      // Prevent loading site in frames
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
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
