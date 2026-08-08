import { NextRequest } from "next/server"; import { create, list } from "@/lib/content";
export const GET = () => list("events"); export const POST = (r: NextRequest) => create("events", r);
