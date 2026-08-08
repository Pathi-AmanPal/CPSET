import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cpset.org";
  const password = "AdminCPSET2026!";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await argon2.hash(password);
    await prisma.admin.create({
      data: {
        email,
        passwordHash,
      },
    });
    console.log(`✅ Default admin created: ${email} / ${password}`);
  } else {
    console.log(`ℹ️ Admin ${email} already exists.`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
