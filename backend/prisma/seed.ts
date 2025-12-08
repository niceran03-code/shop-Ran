import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      username: 'user1',
      password: 'password1', // 演示用，真实项目请使用 hash!
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      username: 'user2',
      password: 'password2',
    },
  });

  // Create dummy categories
  const parentCategory = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
    },
  });

  const childCategory = await prisma.category.upsert({
    where: { name: 'Audio Devices' },
    update: {},
    create: {
      name: 'Audio Devices',
      parentId: parentCategory.id,
    },
  });

  const kitchenCategory = await prisma.category.upsert({
    where: { name: 'Kitchen' },
    update: {},
    create: {
      name: 'Kitchen',
    },
  });

  // Create dummy products
  const product1 = await prisma.product.upsert({
    where: { name: 'Wireless Bluetooth Headphones' },
    update: {},
    create: {
      name: 'Wireless Bluetooth Headphones',
      price: 129.99,
      stock: 50,
      description: 'High-quality wireless headphones with noise cancellation.',
      userId: user1.id,
      categoryId: childCategory.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { name: 'Ceramic Coffee Mug' },
    update: {},
    create: {
      name: 'Ceramic Coffee Mug',
      price: 12.5,
      stock: 200,
      description: 'Durable ceramic mug for hot or cold beverages.',
      userId: user2.id,
      categoryId: kitchenCategory.id,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { name: '4K Smart TV' },
    update: {},
    create: {
      name: '4K Smart TV',
      price: 899.99,
      stock: 20,
      description: 'Large 4K UHD smart TV with HDR support.',
      userId: user1.id,
      categoryId: parentCategory.id,
    },
  });

  console.log({ user1, user2, product1, product2, product3 });
}

main()
  .then(() => {
    console.log('🌱 Seeder executed successfully!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
