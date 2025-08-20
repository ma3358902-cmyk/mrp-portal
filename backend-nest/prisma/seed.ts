import { PrismaClient, Role, Category, PlantCode } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // --- Users (admins/heads, etc.) ---
  const defaultPassword = 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Upsert a few users with roles
  await prisma.user.upsert({
    where: { email: 'admin@mrp.local' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@mrp.local',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'sales.local@mrp.local' },
    update: {},
    create: {
      name: 'Head of Sales - Local',
      email: 'sales.local@mrp.local',
      passwordHash,
      role: Role.SALES_LOCAL,
    },
  });

  await prisma.user.upsert({
    where: { email: 'sales.export@mrp.local' },
    update: {},
    create: {
      name: 'Head of Sales - Export',
      email: 'sales.export@mrp.local',
      passwordHash,
      role: Role.SALES_EXPORT,
    },
  });

  await prisma.user.upsert({
    where: { email: 'ops@mrp.local' },
    update: {},
    create: {
      name: 'Head of Operations & Production',
      email: 'ops@mrp.local',
      passwordHash,
      role: Role.OPS,
    },
  });

  await prisma.user.upsert({
    where: { email: 'supply@mrp.local' },
    update: {},
    create: {
      name: 'Head of Supply Chain',
      email: 'supply@mrp.local',
      passwordHash,
      role: Role.SUPPLY_CHAIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'treasury@mrp.local' },
    update: {},
    create: {
      name: 'Head of Treasury',
      email: 'treasury@mrp.local',
      passwordHash,
      role: Role.TREASURY,
    },
  });

  await prisma.user.upsert({
    where: { email: 'finance@mrp.local' },
    update: {},
    create: {
      name: 'Head of Finance',
      email: 'finance@mrp.local',
      passwordHash,
      role: Role.FINANCE,
    },
  });

  // --- Raw Materials master ---
  const rmPP = await prisma.rawMaterial.upsert({
    where: { code: 'RM-PP' },
    update: {},
    create: {
      code: 'RM-PP',
      name: 'Polypropylene (PP)',
      description: 'Base polymer for BOPP',
      supplier: 'Supplier-A',
    },
  });

  const rmPE = await prisma.rawMaterial.upsert({
    where: { code: 'RM-PE' },
    update: {},
    create: {
      code: 'RM-PE',
      name: 'Polyethylene (PE)',
      description: 'Common CPP component',
      supplier: 'Supplier-B',
    },
  });

  const rmPET = await prisma.rawMaterial.upsert({
    where: { code: 'RM-PET' },
    update: {},
    create: {
      code: 'RM-PET',
      name: 'Polyethylene Terephthalate (PET)',
      description: 'Base polymer for BOPET',
      supplier: 'Supplier-C',
    },
  });

  // --- Finished Goods (Recipes/BOM) ---
  // Example BOPP film
  await prisma.recipe.upsert({
    where: { itemCode: 'BOPP-20MIC' },
    update: {},
    create: {
      itemCode: 'BOPP-20MIC',
      itemName: 'BOPP Film 20 Micron',
      description: 'General purpose BOPP film',
      category: Category.BOPP,
      normalLoss: 2.5,
      compositions: {
        create: [
          { rawMaterialId: rmPP.id, percentage: 98.5 },
          // 1.5% assumed loss covered by normalLoss; if you want an additive, add here
        ],
      },
    },
  });

  // Example CPP film
  await prisma.recipe.upsert({
    where: { itemCode: 'CPP-25MIC' },
    update: {},
    create: {
      itemCode: 'CPP-25MIC',
      itemName: 'CPP Film 25 Micron',
      description: 'Cast polypropylene film',
      category: Category.CPP,
      normalLoss: 3.0,
      compositions: {
        create: [
          { rawMaterialId: rmPE.id, percentage: 97.0 },
        ],
      },
    },
  });

  // Example BOPET film
  await prisma.recipe.upsert({
    where: { itemCode: 'BOPET-12MIC' },
    update: {},
    create: {
      itemCode: 'BOPET-12MIC',
      itemName: 'BOPET Film 12 Micron',
      description: 'Polyester film',
      category: Category.BOPET,
      normalLoss: 2.0,
      compositions: {
        create: [
          { rawMaterialId: rmPET.id, percentage: 98.0 },
        ],
      },
    },
  });

  // (Optional) Show the plant codes exist as enum in code—not a DB table.
  // You’ll choose plants in your app UI using PlantCode.IPAK / GPAK / CPAK / PETPAK
  void PlantCode;
}

main()
  .then(async () => {
    console.log('✅ Seed completed.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
