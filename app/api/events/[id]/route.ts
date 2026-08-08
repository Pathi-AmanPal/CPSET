import { NextRequest } from "next/server"; import { remove, update } from "@/lib/content";
export const PATCH = async (r: NextRequest, { params }: { params: Promise<{ id: string }> }) => update("events", r, (await params).id); export const DELETE = async (r: NextRequest, { params }: { params: Promise<{ id: string }> }) => remove("events", r, (await params).id);
