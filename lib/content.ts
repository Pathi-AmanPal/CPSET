import { ContentKind, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizedMutation } from "@/lib/api";
import { achievementSchema, eventSchema, teamSchema } from "@/lib/validation";
import { apiError, serverError } from "@/lib/http";

export type Kind = "team" | "events" | "achievements";
function validId(id: string) { return /^[a-z0-9]{20,40}$/i.test(id); }
const schema = { team: teamSchema, events: eventSchema, achievements: achievementSchema };
const model = { team: db.team, events: db.event, achievements: db.achievement };
const auditKind = { team: ContentKind.TEAM, events: ContentKind.EVENT, achievements: ContentKind.ACHIEVEMENT };
const publicSelect = {
  team: { id: true, name: true, role: true, bio: true, imageUrl: true },
  events: { id: true, title: true, description: true, eventDate: true, location: true, imageUrl: true },
  achievements: { id: true, title: true, description: true, achievedAt: true, imageUrl: true }
} as const;
function data(kind: Kind, value: unknown): any { const parsed = schema[kind].safeParse(value); if (!parsed.success) return null; const input: any = parsed.data; return kind === "events" ? { ...input, eventDate: new Date(input.eventDate) } : kind === "achievements" ? { ...input, achievedAt: new Date(input.achievedAt) } : input; }
export async function list(kind: Kind) { try { return NextResponse.json(await (model[kind] as any).findMany({ select: publicSelect[kind], orderBy: { createdAt: "desc" } })); } catch (e) { return serverError(e); } }
export async function create(kind: Kind, request: NextRequest) { try { const auth = await authorizedMutation(request); if ("error" in auth) return auth.error; const body = data(kind, await request.json()); if (!body) return apiError("Invalid request body", 400); const item = await db.$transaction(async (tx: Prisma.TransactionClient) => { const created = await (tx[kind === "team" ? "team" : kind === "events" ? "event" : "achievement"] as any).create({ data: body, select: publicSelect[kind] }); await tx.auditLog.create({ data: { adminId: auth.admin.id, action: "CREATE", kind: auditKind[kind], targetId: created.id } }); return created; }); return NextResponse.json(item, { status: 201 }); } catch (e) { return serverError(e); } }
export async function update(kind: Kind, request: NextRequest, id: string) { try { if (!validId(id)) return apiError("Invalid identifier", 400); const auth = await authorizedMutation(request); if ("error" in auth) return auth.error; const body = data(kind, await request.json()); if (!body) return apiError("Invalid request body", 400); const item = await db.$transaction(async (tx: Prisma.TransactionClient) => { const updated = await (tx[kind === "team" ? "team" : kind === "events" ? "event" : "achievement"] as any).update({ where: { id }, data: body, select: publicSelect[kind] }); await tx.auditLog.create({ data: { adminId: auth.admin.id, action: "UPDATE", kind: auditKind[kind], targetId: id } }); return updated; }); return NextResponse.json(item); } catch (e) { if ((e as { code?: string }).code === "P2025") return apiError("Not found", 404); return serverError(e); } }
export async function remove(kind: Kind, request: NextRequest, id: string) { try { if (!validId(id)) return apiError("Invalid identifier", 400); const auth = await authorizedMutation(request); if ("error" in auth) return auth.error; await db.$transaction(async (tx: Prisma.TransactionClient) => { await (tx[kind === "team" ? "team" : kind === "events" ? "event" : "achievement"] as any).delete({ where: { id } }); await tx.auditLog.create({ data: { adminId: auth.admin.id, action: "DELETE", kind: auditKind[kind], targetId: id } }); }); return new NextResponse(null, { status: 204 }); } catch (e) { if ((e as { code?: string }).code === "P2025") return apiError("Not found", 404); return serverError(e); } }
