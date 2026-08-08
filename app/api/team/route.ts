import { NextRequest } from "next/server"; import { create, list } from "@/lib/content";
export const GET = () => list("team"); export const POST = (r: NextRequest) => create("team", r);
