import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating database schema...');

  // Add priceUSD column if it doesn't exist (using raw SQL)
  try {
    await prisma.$executeRaw`
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "priceUSD" DECIMAL(10,2) DEFAULT 0
    `;
    console.log('✅ Added priceUSD column');
  } catch (e) {
    console.log('ℹ️ priceUSD column might already exist');
  }

  // Add isActive column if it doesn't exist
  try {
    await prisma.$executeRaw`
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true
    `;
    console.log('✅ Added isActive column');
  } catch (e) {
    console.log('ℹ️ isActive column might already exist');
  }

  // Create ExchangeRate table if it doesn't exist
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ExchangeRate" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rate DECIMAL(10,2) DEFAULT 385,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✅ Created ExchangeRate table');
  } catch (e) {
    console.log('ℹ️ ExchangeRate table might already exist');
  }

  // Insert default exchange rate if not exists
  const rateCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "ExchangeRate"`;
  // @ts-ignore
  if (rateCount[0].count === 0) {
    await prisma.$executeRaw`INSERT INTO "ExchangeRate" (rate) VALUES (385)`;
    console.log('✅ Added default exchange rate: 385');
  }

  // Update existing products to use priceUSD (copy from price if exists)
  try {
    await prisma.$executeRaw`
      UPDATE "Product" SET "priceUSD" = "price" WHERE "priceUSD" = 0 AND "price" > 0
    `;
    console.log('✅ Migrated prices to USD');
  } catch (e) {
    console.log('ℹ️ Price migration not needed');
  }

  console.log('✅ Database updated successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());