import { PrismaClient } from './app/generated/prisma/client';
import SeedAdmin from './seed/admin.seed';
import process from 'process';
import SeedAttendant from './seed/attendant.seed';

const prisma = new PrismaClient();

const main = async() => {
    console.log('Seeding started....');
    await SeedAdmin();
    await SeedAttendant();
    console.log('Seeding completed....');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
