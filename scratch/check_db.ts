import { db } from "../lib/db";
import argon2 from "argon2";

async function check() {
  console.log("Checking database connection...");
  try {
    const admin = await db.admin.findUnique({
      where: { email: "admin@cpset.org" },
    });
    if (!admin) {
      console.log("❌ Admin admin@cpset.org NOT found in DB!");
    } else {
      console.log("✅ Admin found:", admin.email);
      console.log("Testing argon2 password verify for 'AdminCPSET2026!'...");
      const match = await argon2.verify(admin.passwordHash, "AdminCPSET2026!");
      console.log("Password match result:", match);
    }
  } catch (err) {
    console.error("❌ DB Query Error:", err);
  } finally {
    await db.$disconnect();
  }
}

check();
