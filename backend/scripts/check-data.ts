import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rates = await prisma.exchangeRate.findMany({ orderBy: { updatedAt: 'desc' } });
  console.log('ExchangeRate table:', JSON.stringify(rates, null, 2));
  
  // Also check products
  const products = await prisma.product.count();
  console.log('Products count:', products);
  
  const orders = await prisma.order.count();
  console.log('Orders count:', orders);
  
  const categories = await prisma.category.count();
  console.log('Categories count:', categories);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());