// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  // ---------------------------
  // 1. Create Admin User
  // ---------------------------
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'hashed-password', //  显示用途，真实项目请替换为 bcrypt 哈希
    },
  });

  // ---------------------------
  // 2. Create Categories
  // ---------------------------
  const electronics = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Electronics',
    },
  });

  const phones = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Mobile Phones',
      parentId: electronics.id,
    },
  });

  // ---------------------------
  // 3. Create Products
  // ---------------------------
  const product1 = await prisma.product.upsert({
    where: { name: 'iPhone 15' },
    update: {},
    create: {
      name: 'iPhone 15',
      price: 899.99,
      stock: 100,
      isActive: true,
      description: 'Latest Apple iPhone 15',
      userId: adminUser.id,
      categoryId: phones.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { name: 'Samsung Galaxy S24' },
    update: {},
    create: {
      name: 'Samsung Galaxy S24',
      price: 799.99,
      stock: 50,
      isActive: true,
      description: 'Samsung flagship smartphone',
      userId: adminUser.id,
      categoryId: phones.id,
    },
  });

  console.log({
    adminUser,
    electronics,
    phones,
    product1,
    product2,
  });

  console.log(' Database seeded successfully!');
}

main()
  .catch((err) => {
    console.error(' Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
