import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migrating data...');

  // Migrate price to priceUSD
  const result = await prisma.$executeRaw`
    UPDATE "Product" SET "priceUSD" = "price" WHERE "priceUSD" = 0
  `;
  console.log('✅ Migrated products to priceUSD');

  // Add default exchange rate
  await prisma.$executeRaw`
    INSERT INTO "ExchangeRate" (id, rate) VALUES (gen_random_uuid(), 385)
    ON CONFLICT DO NOTHING
  `;
  console.log('✅ Added default exchange rate');

  console.log('✅ Migration complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());