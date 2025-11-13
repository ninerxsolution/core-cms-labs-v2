import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists, skipping...");
    return;
  }

  // Hash password (default: "admin123")
  const passwordHash = await bcrypt.hash("admin123", 10);

  // Create root admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Root Admin",
      passwordHash,
    },
  });

  console.log("✅ Created root admin user:");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   ID: ${admin.id}`);
  console.log("\n⚠️  Default password: admin123");
  console.log("   Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

