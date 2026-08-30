import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { createHmac } from "crypto";

function csrfSecret() {
  const sec = process.env.SESSION_SECRET;
  if (!sec || sec.length < 32) throw new Error("SESSION_SECRET is missing or too short");
  return sec;
}

function csrfDigest(token: string) {
  return createHmac("sha256", csrfSecret()).update(token).digest("hex");
}

/**
 * Verifies the request Origin matches this server's host.
 *
 * Requests with NO Origin header are rejected — this closes the gap where
 * direct API callers (curl, Burp Suite, server-to-server) omit the header
 * and previously passed the check.
 */
export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false; // Reject when Origin is absent
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function authorizedMutation(request: NextRequest) {
  if (!sameOrigin(request) || request.headers.get("x-requested-with") !== "XMLHttpRequest")
    return { error: apiError("Invalid request", 403) };
  const admin = await requireAdmin();
  if (!admin) return { error: apiError("Unauthorized", 401) };
  const csrf = request.headers.get("x-csrf-token");
  if (!csrf || csrfDigest(csrf) !== admin.csrfTokenHash)
    return { error: apiError("Invalid request", 403) };
  return { admin };
}
