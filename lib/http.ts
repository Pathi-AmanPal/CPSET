import { NextResponse } from "next/server";
export function apiError(message: string, status: number) { return NextResponse.json({ error: message }, { status }); }
export function serverError(error: unknown) { console.error("API error", error instanceof Error ? error.message : "unknown"); return apiError("An unexpected error occurred", 500); }
