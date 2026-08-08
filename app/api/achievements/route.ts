import { NextRequest } from "next/server"; import { create, list } from "@/lib/content";
export const GET = () => list("achievements"); export const POST = (r: NextRequest) => create("achievements", r);
