import { PrismaClient } from '../app/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SeedAdmin = async () => {
  const password = await bcrypt.hash('password', 10);

  const email = 'admin@pms.com';

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      password,
      role: 'Admin',
      status: 'ENABLED',
      isVerified: true,
    },
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email,
      password,
      role: 'Admin',
      status: 'ENABLED',
      isVerified: true,
    },
  });

  console.log('Admin user seeded:', admin);
};

export default SeedAdmin;
