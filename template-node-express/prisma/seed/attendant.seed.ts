import { PrismaClient } from '../app/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SeedAttendant = async () => {
  const password = await bcrypt.hash('password', 10);

  const email = 'attendant@pms.com';

  const attendant = await prisma.user.upsert({
    where: { email },
    update: {
      firstName: 'Attendant',
      lastName: 'User',
      password,
      role: 'ParkingAttendant',
      status: 'ENABLED',
      isVerified: true,
    },
    create: {
      firstName: 'Attendant',
      lastName: 'User',
      email,
      password,
      role: 'ParkingAttendant',
      status: 'ENABLED',
      isVerified: true,
    },
  });

  console.log('Attendant user seeded:', attendant);
};

export default SeedAttendant;
