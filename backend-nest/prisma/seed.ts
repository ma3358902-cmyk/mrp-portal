// backend-nest/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // No-op seed for now. Add real seed data later when models are finalized.
  // Example template for later:
  // await prisma.user.upsert({
  //   where: { email: 'admin@example.com' },
  //   update: {},
  //   create: { email: 'admin@example.com', name: 'Admin', passwordHash: '...' },
  // });
  return;
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
