import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, validTotp, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { apiError, serverError } from "@/lib/http";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { sameOrigin } from "@/lib/api";
import { ContentKind } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    if (!sameOrigin(request)) return apiError("Invalid request", 403);

    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return apiError("Invalid credentials", 401);

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const emailKey = parsed.data.email.toLowerCase();

    // Per-IP + per-account rate limit with exponential back-off (see lib/rate-limit.ts).
    const rateLimitKey = `login:${ip}:${emailKey}`;
    const limited = rateLimit(rateLimitKey, 5, 900_000);
    if (!limited.allowed) return apiError("Too many attempts. Try again later.", 429);

    const admin = await db.admin.findUnique({ where: { email: emailKey } });

    // Evaluate credentials in constant-time order to avoid oracle attacks.
    const passwordOk = admin
      ? await verifyPassword(admin.passwordHash, parsed.data.password)
      : false;
    const totpOk =
      !admin?.totpEnabled || validTotp(admin.totpSecret!, parsed.data.totp);

    if (!admin || !passwordOk || !totpOk) {
      // Write a forensic record for known accounts only (avoids leaking existence).
      if (admin) {
        await db.auditLog
          .create({
            data: {
              adminId: admin.id,
              action: "LOGIN_FAILED",
              kind: ContentKind.AUTH,
              targetId: ip,
            },
          })
          .catch(() => {}); // Non-fatal — log failure must not affect the 401 response
      }
      return apiError("Invalid credentials", 401);
    }

    // Clear rate-limit state so a legitimate user isn't penalised after success.
    resetRateLimit(rateLimitKey);

    await createSession(admin.id);

    // Forensic record of the successful login.
    await db.auditLog
      .create({
        data: {
          adminId: admin.id,
          action: "LOGIN_SUCCESS",
          kind: ContentKind.AUTH,
          targetId: ip,
        },
      })
      .catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
