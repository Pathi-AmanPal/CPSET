import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import argon2 from "argon2";

export async function GET() {
  try {
    const email = "admin@cpset.org";
    const password = "AdminCPSET2026!";

    const existing = await db.admin.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await argon2.hash(password);
      await db.admin.create({
        data: {
          email,
          passwordHash,
        },
      });
      return NextResponse.json({
        success: true,
        message: `Admin created: ${email} / ${password}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Admin ${email} already exists in database.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Seeding failed",
      },
      { status: 500 }
    );
  }
}
