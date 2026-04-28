import { PrismaClient, AppRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tyson.styles' },
    update: {},
    create: {
      email: 'admin@tyson.styles',
      password: adminPassword,
      name: 'Administrador',
      role: AppRole.ADMIN,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create categories
  const categories = [
    { name: 'Champús', slug: 'champus', icon: '🧴', sortOrder: 1 },
    { name: 'Acondicionadores', slug: 'acondicionadores', icon: '💆', sortOrder: 2 },
    { name: 'Mascarillas', slug: 'mascarillas', icon: '🧖', sortOrder: 3 },
    { name: 'Aceites', slug: 'aceites', icon: '✨', sortOrder: 4 },
    { name: 'Geles y Cremas', slug: 'geles-cremas', icon: '💅', sortOrder: 5 },
    { name: 'Accesorios', slug: 'accesorios', icon: '🎀', sortOrder: 6 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c.id;
  }
  console.log(`✅ ${categories.length} categories created`);

  // Create products
  const products = [
    { name: 'Champú Hidratante Rizos', slug: 'champu-hidratante-rizos', description: 'Champú sin sulfatos con aceite de argán y karité. Hidrata profundamente los rizos sin apelmazarlos. Ideal para cabellos secos y rizados.', price: 18.50, categorySlug: 'champus', imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400', stock: 25, featured: true },
    { name: 'Champú Clarificante Curl', slug: 'champu-clarificante-curl', description: 'Champú clarificante suave que elimina residuos sin stripping. Perfecto para una limpieza profunda semanal.', price: 16.00, categorySlug: 'champus', imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400', stock: 20, featured: false },
    { name: 'Co-Wash Cremoso', slug: 'co-wash-cremoso', description: 'Acondicionador lavable que limpia el cuero cabelludo suavemente. Alternativa al champú tradicional para días de refresh.', price: 17.00, categorySlug: 'champus', imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400', stock: 15, featured: true },
    { name: 'Acondicionador Sin Peso', slug: 'acondicionador-sin-peso', description: 'Acondicionador ultra-ligero que desenreda e hidrata sin dejar residuos. Perfecto para rizos finos que necesitan definición sin peso.', price: 19.00, categorySlug: 'acondicionadores', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a4e4?w=400', stock: 30, featured: true },
    { name: 'Acondicionador con Proteínas', slug: 'acondicionador-proteinas', description: 'Acondicionador enriquecido con proteína de arroz y queratina vegetal. Restaura y fortalece las hebras dañadas.', price: 21.00, categorySlug: 'acondicionadores', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a4e4?w=400', stock: 18, featured: false },
    { name: 'Leave-In Spray Rizos', slug: 'leave-in-rizos-perfectos', description: 'Spray leave-in con Aloe Vera y aceite de coco. Hidrata, define y previene el frizz durante todo el día.', price: 15.50, categorySlug: 'acondicionadores', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a4e4?w=400', stock: 22, featured: false },
    { name: 'Mascarilla Nutritiva Profunda', slug: 'mascarilla-nutritiva-profunda', description: 'Mascarilla de tratamiento intensivo con manteca de karité y aceite de oliva. Nutre en profundidad cabellos muy secos y porosos.', price: 24.00, categorySlug: 'mascarillas', imageUrl: 'https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=400', stock: 20, featured: true },
    { name: 'Mascarilla Reparadora Keratina', slug: 'mascarilla-reparadora-keratina', description: 'Tratamiento reparador con keratina hidrolizada. Reduce rotura y restaura la integridad de la fibra capilar.', price: 26.00, categorySlug: 'mascarillas', imageUrl: 'https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=400', stock: 15, featured: false },
    { name: 'Aceite de Argán Puro', slug: 'aceite-argan-puro', description: 'Aceite de argán 100% puro prensado en frío. Nutre, brilla y sella la cutícula. Elixir para rizos secos.', price: 28.00, categorySlug: 'aceites', imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d7bf9ef1f?w=400', stock: 25, featured: true },
    { name: 'Aceite de Coco Fraccionado', slug: 'aceite-coco-fraccionado', description: 'Aceite de coco MCT de cadena media. Ligero, de rápida absorción. Ideal para sellar hidratación sin apelmazar.', price: 22.00, categorySlug: 'aceites', imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d7bf9ef1f?w=400', stock: 20, featured: false },
    { name: 'Crema Definidora de Rizos', slug: 'crema-definidora-rizos', description: 'Crema definidora con polímeros flexibles. Define rizos sin crunch, con un finish suave y natural.', price: 19.50, categorySlug: 'geles-cremas', imageUrl: 'https://images.unsplash.com/photo-1527799820374-d8238a5a3a5f?w=400', stock: 28, featured: true },
    { name: 'Gel Fijador Rizos', slug: 'gel-fijador-rizos', description: 'Gel de fuerte fijación con tecnología humidity-resistant. Define y mantiene rizos hasta 48h sin encoger (shrinkage).', price: 14.00, categorySlug: 'geles-cremas', imageUrl: 'https://images.unsplash.com/photo-1527799820374-d8238a5a3a5f?w=400', stock: 35, featured: false },
    { name: 'Mousse Voluminizadora', slug: 'mousse-voluminizadora', description: 'Mousse de volumen con tecnología foam-expand. Añade cuerpo y definición sin peso ni residuo.', price: 16.50, categorySlug: 'geles-cremas', imageUrl: 'https://images.unsplash.com/photo-1527799820374-d8238a5a3a5f?w=400', stock: 22, featured: false },
    { name: 'Difusor Universal Pro', slug: 'difusor-universal-pro', description: 'Difusor de silicona universal. Se adapta a cualquier secador. Distribuye el aire suavemente para minimizar el frizz.', price: 12.00, categorySlug: 'accesorios', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a4e4?w=400', stock: 15, featured: false },
    { name: 'Toalla Microfibra Curl', slug: 'toalla-microfibra-curl', description: 'Toalla de microfibra ultra-suave 40x80cm. Absorbe el exceso de agua sin agresivo wringing. Reduce rotura un 40%.', price: 15.00, categorySlug: 'accesorios', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a4e4?w=400', stock: 30, featured: false },
    { name: 'Peine Dientes Anchos', slug: 'peine-dientes-anchos', description: 'Peine de dientes anchos en bamboo ecológico. Desenreda suavemente rizos húmedos sin romper la estructura.', price: 8.00, categorySlug: 'accesorios', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a4e4?w=400', stock: 40, featured: false },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceUSD: p.price,
        categoryId: createdCategories[p.categorySlug],
        imageUrl: p.imageUrl,
        stock: p.stock,
        featured: p.featured,
      },
    });
  }
  console.log(`✅ ${products.length} products created`);

  // Create sample reviews
  const sampleProduct = await prisma.product.findFirst();
  if (sampleProduct) {
    const existingReviews = await prisma.review.count({ where: { productId: sampleProduct.id } });
    if (existingReviews === 0) {
      const reviews = [
        { authorName: 'María García', rating: 5, comment: 'Increíble producto. Mis rizos han mejorado muchísimo desde que lo uso.' },
        { authorName: 'Lucía Fernández', rating: 5, comment: 'El mejor que he probado para mi tipo de cabello. 100% recomendado.' },
        { authorName: 'Carmen Ruiz', rating: 4, comment: 'Muy buen producto, deja el cabello suave y con brillo.' },
      ];
      for (const r of reviews) {
        await prisma.review.create({
          data: { ...r, productId: sampleProduct.id, approved: true },
        });
      }
      console.log(`✅ ${reviews.length} sample reviews created`);
    }
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });