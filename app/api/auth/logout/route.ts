import { NextRequest, NextResponse } from "next/server"; import { destroySession } from "@/lib/auth"; import { authorizedMutation } from "@/lib/api";
export async function POST(request: NextRequest) { const auth = await authorizedMutation(request); if ("error" in auth) return auth.error; await destroySession(); return NextResponse.json({ ok: true }); }
