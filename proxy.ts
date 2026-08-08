import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const isDev = process.env.NODE_ENV !== "production";
const policy = `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' ${isDev ? "'unsafe-inline' 'unsafe-eval'" : "'unsafe-inline'"}; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.public.blob.vercel-storage.com data:; connect-src 'self' ws: wss:; upgrade-insecure-requests`;

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const isLogin = request.nextUrl.pathname === "/api/auth/login";
    const result = rateLimit(`${ip}:${request.nextUrl.pathname}`, isLogin ? 5 : 100, isLogin ? 900_000 : 60_000);
    if (!result.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(result.retryAfter) } });
  }
  const response = NextResponse.next();
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = { matcher: "/:path*" };
