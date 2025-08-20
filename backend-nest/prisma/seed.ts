// prisma/seed.ts
import { PrismaClient, Category, PlantCode, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // --- 1) Admin user -------------------------------------------------------
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123'; // change in production
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      passwordHash: adminHash,
      role: Role.ADMIN, // enum: ADMIN | USER
    },
  });

  // (Optional) a couple of regular users for testing
  const userHash = await bcrypt.hash('ChangeMe123!', 10);
  await prisma.user.createMany({
    data: [
      { name: 'Sales Local', email: 'sales.local@mrp.local', passwordHash: userHash, role: Role.USER },
      { name: 'Ops',         email: 'ops@mrp.local',         passwordHash: userHash, role: Role.USER },
    ],
    skipDuplicates: true,
  });

  // --- 2) Plants (Plant + PlantCode enum) ----------------------------------
  const plants: Array<{ code: PlantCode; name: string }> = [
    { code: PlantCode.IPAK,   name: 'IPAK' },
    { code: PlantCode.GPAK,   name: 'GPAK' },
    { code: PlantCode.CPAK,   name: 'CPAK' },
    { code: PlantCode.PETPAK, name: 'PETPAK' },
  ];

  for (const p of plants) {
    await prisma.plant.upsert({
      where: { code: p.code }, // unique
      update: { name: p.name },
      create: { code: p.code, name: p.name },
    });
  }

  // --- 3) Raw Materials -----------------------------------------------------
  const rms: Array<{ code: string; name: string; uom?: string; supplier?: string | null }> = [
    { code: 'RM-RESIN',    name: 'Polymer Resin',  uom: 'KG' },
    { code: 'RM-ADDITIVE', name: 'Additive Pack',  uom: 'KG' },
    { code: 'RM-SOLVENT',  name: 'Solvent',        uom: 'L'  },
  ];

  for (const rm of rms) {
    await prisma.rawMaterial.upsert({
      where: { code: rm.code },
      update: { name: rm.name, uom: rm.uom ?? 'KG', supplier: rm.supplier ?? null },
      create: { code: rm.code, name: rm.name, uom: rm.uom ?? 'KG', supplier: rm.supplier ?? null },
    });
  }

  // --- 4) Finished Goods ----------------------------------------------------
  const fgs: Array<{ code: string; name: string; category?: Category | null; subCategory?: string | null; uom?: string | null; }> = [
    { code: 'FG-BOPP-01',  name: 'BOPP Film A',  category: Category.BOPP,  uom: 'KG' },
    { code: 'FG-CPP-01',   name: 'CPP Film A',   category: Category.CPP,   uom: 'KG' },
    { code: 'FG-BOPET-01', name: 'BOPET Film A', category: Category.BOPET, uom: 'KG' },
  ];

  for (const fg of fgs) {
    await prisma.finishedGood.upsert({
      where: { code: fg.code },
      update: { name: fg.name, category: fg.category ?? null, subCategory: fg.subCategory ?? null, uom: fg.uom ?? 'KG' },
      create: { code: fg.code, name: fg.name, category: fg.category ?? null, subCategory: fg.subCategory ?? null, uom: fg.uom ?? 'KG' },
    });
  }

  // --- 5) Sample BOM for FG-BOPP-01 (only if no ACTIVE BOM exists) ---------
  const fg = await prisma.finishedGood.findUnique({ where: { code: 'FG-BOPP-01' } });
  if (fg) {
    const existingActive = await prisma.bOM.findFirst({
      where: { fgId: fg.id, status: 'ACTIVE' },
    });

    if (!existingActive) {
      const rmResin    = await prisma.rawMaterial.findUnique({ where: { code: 'RM-RESIN' } });
      const rmAdditive = await prisma.rawMaterial.findUnique({ where: { code: 'RM-ADDITIVE' } });

      const linesData: Array<{ rmId: number; qty: number }> = [];
      if (rmResin)    linesData.push({ rmId: rmResin.id,    qty: 0.92 });
      if (rmAdditive) linesData.push({ rmId: rmAdditive.id, qty: 0.08 });

      await prisma.bOM.create({
        data: {
          fgId: fg.id,
          version: 1,
          status: 'ACTIVE',
          lines: { createMany: { data: linesData } },
        },
      });
    }
  }

  console.log('✅ Seed completed.');
}

main()
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
