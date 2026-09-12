import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import { authorizedMutation, sameOrigin } from "@/lib/api";
import { requireAdmin, invalidateAllSessions } from "@/lib/auth";
import { apiError, serverError } from "@/lib/http";
import { db } from "@/lib/db";
import { z } from "zod";

const enableSchema = z.object({ token: z.string().regex(/^\d{6}$/) });

/**
 * GET /api/auth/totp
 * Generates a fresh TOTP secret for the authenticated admin and returns it
 * alongside an otpauth:// URL that any TOTP app can scan.
 *
 * The secret is persisted immediately so it survives across requests, but
 * `totpEnabled` stays false until the admin POSTs a valid code.
 */
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return apiError("Unauthorized", 401);
    if (admin.totpEnabled) return apiError("TOTP is already enabled", 409);

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(admin.email, "CPSET Admin", secret);

    // Temporarily store the pending secret (overwritten on each GET until confirmed).
    await db.admin.update({ where: { id: admin.id }, data: { totpSecret: secret } });

    return NextResponse.json({ secret, otpauthUrl });
  } catch (e) {
    return serverError(e);
  }
}

/**
 * POST /api/auth/totp
 * Verifies the provided 6-digit token against the pending TOTP secret and,
 * on success, sets `totpEnabled = true` for the admin.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authorizedMutation(request);
    if ("error" in auth) return auth.error;

    const parsed = enableSchema.safeParse(await request.json());
    if (!parsed.success) return apiError("Invalid token format", 400);

    const adminRecord = await db.admin.findUnique({ where: { id: auth.admin.id } });
    if (!adminRecord?.totpSecret) return apiError("Generate a TOTP secret first (GET /api/auth/totp)", 400);

    if (!authenticator.check(parsed.data.token, adminRecord.totpSecret))
      return apiError("Invalid TOTP token", 400);

    await db.admin.update({ where: { id: auth.admin.id }, data: { totpEnabled: true } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}

/**
 * DELETE /api/auth/totp
 * Disables TOTP and clears the stored secret.
 * Also invalidates all active sessions so the admin must re-authenticate
 * (without TOTP) — preventing a window where an attacker who holds a session
 * can disable MFA silently.
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await authorizedMutation(request);
    if ("error" in auth) return auth.error;

    await db.admin.update({
      where: { id: auth.admin.id },
      data: { totpEnabled: false, totpSecret: null },
    });

    // Force re-login after disabling MFA (security event).
    await invalidateAllSessions(auth.admin.id);

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return serverError(e);
  }
}
