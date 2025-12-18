// prisma/seed.ts

/*
POST /auth/login
{
  "email": "user1@example.com",
  "password": "password-sabin"
}
*/

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
  // ==========================
  // Passwords
  // ==========================
  const passwordSabin = await bcrypt.hash('password-sabin', roundsOfHashing);
  const passwordAlex = await bcrypt.hash('password-alex', roundsOfHashing);
  const passwordTom = await bcrypt.hash('password-tom', roundsOfHashing);
  const passwordLucy = await bcrypt.hash('password-lucy', roundsOfHashing);
  const passwordMike = await bcrypt.hash('password-mike', roundsOfHashing);
  const passwordEmma = await bcrypt.hash('password-emma', roundsOfHashing);
  const passwordJack = await bcrypt.hash('password-jack', roundsOfHashing);

  // ==========================
  // Users
  // ==========================
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {
      password: passwordSabin,
      role: 'ADMIN',
    },

    create: {
      email: 'user1@example.com',
      username: 'Sabin',
      password: passwordSabin,
      role: 'ADMIN',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: { password: passwordAlex },
    create: {
      email: 'user2@example.com',
      username: 'Alex',
      password: passwordAlex,
    },
  });

  const tom = await prisma.user.upsert({
    where: { email: 'tom@example.com' },
    update: { password: passwordTom },
    create: {
      email: 'tom@example.com',
      username: 'Tom',
      password: passwordTom,
    },
  });

  const lucy = await prisma.user.upsert({
    where: { email: 'lucy@example.com' },
    update: { password: passwordLucy },
    create: {
      email: 'lucy@example.com',
      username: 'Lucy',
      password: passwordLucy,
    },
  });

  const mike = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: { password: passwordMike },
    create: {
      email: 'mike@example.com',
      username: 'Mike',
      password: passwordMike,
    },
  });

  const emma = await prisma.user.upsert({
    where: { email: 'emma@example.com' },
    update: { password: passwordEmma },
    create: {
      email: 'emma@example.com',
      username: 'Emma',
      password: passwordEmma,
    },
  });

  const jack = await prisma.user.upsert({
    where: { email: 'jack@example.com' },
    update: { password: passwordJack },
    create: {
      email: 'jack@example.com',
      username: 'Jack',
      password: passwordJack,
    },
  });

  // ==========================
  // Categories (Multi-level)
  // ==========================
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics' },
  });

  const audio = await prisma.category.upsert({
    where: { name: 'Audio Devices' },
    update: {},
    create: {
      name: 'Audio Devices',
      parentId: electronics.id,
    },
  });

  const computers = await prisma.category.upsert({
    where: { name: 'Computers' },
    update: {},
    create: {
      name: 'Computers',
      parentId: electronics.id,
    },
  });

  const laptops = await prisma.category.upsert({
    where: { name: 'Laptops' },
    update: {},
    create: {
      name: 'Laptops',
      parentId: computers.id,
    },
  });

  const accessories = await prisma.category.upsert({
    where: { name: 'Accessories' },
    update: {},
    create: {
      name: 'Accessories',
      parentId: computers.id,
    },
  });

  const kitchen = await prisma.category.upsert({
    where: { name: 'Kitchen' },
    update: {},
    create: { name: 'Kitchen' },
  });

  const fashion = await prisma.category.upsert({
    where: { name: 'Fashion' },
    update: {},
    create: { name: 'Fashion' },
  });

  const menFashion = await prisma.category.upsert({
    where: { name: 'Men Fashion' },
    update: {},
    create: {
      name: 'Men Fashion',
      parentId: fashion.id,
    },
  });

  const womenFashion = await prisma.category.upsert({
    where: { name: 'Women Fashion' },
    update: {},
    create: {
      name: 'Women Fashion',
      parentId: fashion.id,
    },
  });

  const sports = await prisma.category.upsert({
    where: { name: 'Sports' },
    update: {},
    create: { name: 'Sports' },
  });

  const outdoor = await prisma.category.upsert({
    where: { name: 'Outdoor Sports' },
    update: {},
    create: {
      name: 'Outdoor Sports',
      parentId: sports.id,
    },
  });

  // ==========================
  // Products
  // ==========================
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      price: 129.99,
      stock: 50,
      description: 'Noise cancelling over-ear headphones.',
      userId: user1.id,
      categoryId: audio.id,
    },
    {
      name: 'Gaming Laptop',
      price: 1599.0,
      stock: 15,
      description: 'High performance laptop for gaming.',
      userId: tom.id,
      categoryId: laptops.id,
    },
    {
      name: 'Mechanical Keyboard',
      price: 119.0,
      stock: 70,
      description: 'RGB mechanical keyboard.',
      userId: jack.id,
      categoryId: accessories.id,
    },
    {
      name: 'Wireless Mouse',
      price: 39.99,
      stock: 120,
      description: 'Ergonomic wireless mouse.',
      userId: mike.id,
      categoryId: accessories.id,
    },
    {
      name: 'Smart Speaker',
      price: 89.0,
      stock: 60,
      description: 'Voice controlled smart speaker.',
      userId: lucy.id,
      categoryId: audio.id,
    },
    {
      name: 'Ceramic Coffee Mug',
      price: 12.5,
      stock: 200,
      description: 'Classic ceramic mug.',
      userId: user2.id,
      categoryId: kitchen.id,
    },
    {
      name: 'Non-stick Frying Pan',
      price: 45.0,
      stock: 90,
      description: 'Durable non-stick pan.',
      userId: emma.id,
      categoryId: kitchen.id,
    },
    {
      name: 'Men Casual T-Shirt',
      price: 29.9,
      stock: 150,
      description: 'Comfortable cotton T-shirt.',
      userId: tom.id,
      categoryId: menFashion.id,
    },
    {
      name: 'Women Summer Dress',
      price: 59.9,
      stock: 80,
      description: 'Elegant lightweight dress.',
      userId: lucy.id,
      categoryId: womenFashion.id,
    },
    {
      name: 'Running Shoes',
      price: 99.99,
      stock: 60,
      description: 'Breathable running shoes.',
      userId: mike.id,
      categoryId: outdoor.id,
    },
    {
      name: 'Camping Tent',
      price: 249.99,
      stock: 25,
      description: 'Waterproof 4-person tent.',
      userId: jack.id,
      categoryId: outdoor.id,
    },
    {
      name: 'Fitness Tracker Watch',
      price: 149.0,
      stock: 45,
      description: 'Track heart rate and steps.',
      userId: emma.id,
      categoryId: sports.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log(' Database seeded ');
}

main()
  .then(() => {
    console.log(' Seeder executed successfully!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
