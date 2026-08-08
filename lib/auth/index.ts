import "server-only";
import argon2 from "argon2";
import { authenticator } from "otplib";
import { createHmac, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const COOKIE = "cpset_session", CSRF_COOKIE = "cpset_csrf", LIFE_MS = 1000 * 60 * 60 * 12, ABSOLUTE_LIFE_MS = 1000 * 60 * 60 * 24;
function secret() { const value = process.env.SESSION_SECRET; if (!value || value.length < 32) throw new Error("SESSION_SECRET is missing or too short"); return value; }
function digest(token: string) { return createHmac("sha256", secret()).update(token).digest("hex"); }
function cookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: LIFE_MS / 1000 }; }
export async function verifyPassword(hash: string, password: string) {
  try { return await argon2.verify(hash, password); }
  catch (e) { console.error("Password verification error:", e); return false; }
}
export async function createSession(adminId: string) {
  const token = randomBytes(32).toString("base64url"), csrfToken = randomBytes(32).toString("base64url");
  await db.session.create({ data: { adminId, tokenHash: digest(token), csrfTokenHash: digest(csrfToken), expiresAt: new Date(Date.now() + LIFE_MS) } });
  (await cookies()).set(COOKIE, token, cookieOptions());
  (await cookies()).set(CSRF_COOKIE, csrfToken, { ...cookieOptions(), httpOnly: false });
}
export async function destroySession() { const jar = await cookies(); const token = jar.get(COOKIE)?.value; if (token) await db.session.deleteMany({ where: { tokenHash: digest(token) } }); jar.delete(COOKIE); jar.delete(CSRF_COOKIE); }
export async function requireAdmin() {
  const token = (await cookies()).get(COOKIE)?.value; if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash: digest(token) }, include: { admin: { select: { id: true, email: true } } } });
  if (!session || session.expiresAt <= new Date()) { if (session) await db.session.delete({ where: { id: session.id } }); return null; }
  const hardExpiry = session.createdAt.getTime() + ABSOLUTE_LIFE_MS;
  if (hardExpiry <= Date.now()) { await db.session.delete({ where: { id: session.id } }); return null; }
  await db.session.update({ where: { id: session.id }, data: { lastActiveAt: new Date(), expiresAt: new Date(Math.min(Date.now() + LIFE_MS, hardExpiry)) } });
  return { ...session.admin, csrfTokenHash: session.csrfTokenHash };
}
export function validTotp(secret: string, token?: string) { return !!token && authenticator.check(token, secret); }
