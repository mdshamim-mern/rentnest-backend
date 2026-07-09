import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12); 
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rentnest.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@rentnest.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });