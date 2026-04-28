import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating products...');

  // Migrate price to priceUSD
  await prisma.$executeRaw`
    UPDATE "Product" SET "priceUSD" = "price" WHERE "priceUSD" IS NULL OR "priceUSD" = 0
  `;
  console.log('✅ Migrated price to priceUSD');

  // Also update active to isActive
  await prisma.$executeRaw`
    UPDATE "Product" SET "isActive" = "active" WHERE "isActive" IS NULL
  `;
  console.log('✅ Migrated active to isActive');

  // Delete the test product
  await prisma.$executeRaw`
    DELETE FROM "Product" WHERE name = 'dwa'
  `;
  console.log('✅ Deleted test product');

  console.log('✅ Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());