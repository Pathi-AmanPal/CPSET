import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { createHmac } from "crypto";
function csrfDigest(token: string) { return createHmac("sha256", process.env.SESSION_SECRET || "").update(token).digest("hex"); }
export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin") || request.headers.get("referer");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    return originUrl.host === request.nextUrl.host;
  } catch {
    return false;
  }
}
export async function authorizedMutation(request: NextRequest) {
  if (!sameOrigin(request) || request.headers.get("x-requested-with") !== "XMLHttpRequest") return { error: apiError("Invalid request", 403) };
  const admin = await requireAdmin();
  if (!admin) return { error: apiError("Unauthorized", 401) };
  const csrf = request.headers.get("x-csrf-token");
  if (!csrf || csrfDigest(csrf) !== admin.csrfTokenHash) return { error: apiError("Invalid request", 403) };
  return { admin };
}
