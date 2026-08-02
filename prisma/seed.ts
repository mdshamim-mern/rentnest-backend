import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12); 
  
  await prisma.user.upsert({
    where: { email: 'admin@rentnest.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@rentnest.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const categories = [
    'Apartment',
    'Villa',
    'Duplex',
    'Penthouse',
    'Townhouse',
    'Studio',
    'Single Room',
    'Sublet Room',
    'Hostel'
  ];

  for (const catName of categories) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
  }

  console.log('Database seeded successfully with Admin and Categories!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });