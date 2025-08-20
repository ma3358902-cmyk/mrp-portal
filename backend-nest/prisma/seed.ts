// backend-nest/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN' as any, // string to avoid enum import
    },
  });

  // Plants
  await prisma.plant.createMany({
    data: [
      { code: 'IPAK' as any, name: 'Islamabad Plant' },
      { code: 'GPAK' as any, name: 'Gujranwala Plant' },
    ],
    skipDuplicates: true,
  });

  // Raw materials
  await prisma.rawMaterial.createMany({
    data: [
      { code: 'RM-PE', name: 'Polyethylene', uom: 'KG' },
      { code: 'RM-PP', name: 'Polypropylene', uom: 'KG' },
    ],
    skipDuplicates: true,
  });

  // Finished goods
  const fg = await prisma.finishedGood.upsert({
    where: { code: 'FG-PACK1' },
    update: {},
    create: {
      code: 'FG-PACK1',
      name: 'Packaging Film',
      category: 'BOPP' as any,
      subCategory: 'General',
      uom: 'KG',
    },
  });

  const rmPE = await prisma.rawMaterial.findUnique({ where: { code: 'RM-PE' } });

  // Simple BOM for the FG
  if (rmPE) {
    const bom = await prisma.bOM.create({
      data: { fgId: fg.id, version: 1, status: 'ACTIVE' },
    });
    await prisma.bOMLine.create({
      data: { bomId: bom.id, rmId: rmPE.id, qty: 1.0 },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
