import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Single source-of-truth Content Security Policy.
 *
 * – `unsafe-eval` is only present in development (Next.js HMR requires it).
 * – Vercel Analytics / Speed Insights domains are explicitly allow-listed.
 * – The duplicate CSP in next.config.mjs has been removed; this entry wins.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://vercel.live https://*.vercel-insights.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://chart.googleapis.com",
  "connect-src 'self' https://vercel.live https://*.vercel-insights.com https://raw.githubusercontent.com ws: wss:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** Admin paths that must remain publicly accessible (no session required). */
const ADMIN_PUBLIC_PATHS = new Set(["/admin/login", "/admin/login/"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin route protection (edge layer — defence-in-depth) ────────────────
  // Guards EVERY /admin/* path except the login page itself.
  // The RSC layout (app/admin/(protected)/layout.tsx) is a second layer.
  if (pathname.startsWith("/admin")) {
    const isPublic =
      ADMIN_PUBLIC_PATHS.has(pathname) || pathname.startsWith("/admin/login/");
    if (!isPublic) {
      const sessionToken = request.cookies.get("cpset_session")?.value;
      if (!sessionToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
  }

  // ── Rate limiting for API routes ──────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const isLogin = pathname === "/api/auth/login";
    const result = rateLimit(
      `${ip}:${pathname}`,
      isLogin ? 5 : 100,
      isLogin ? 900_000 : 60_000
    );
    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(result.retryAfter) } }
      );
    }
  }

  // ── Security headers ──────────────────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = { matcher: "/:path*" };
