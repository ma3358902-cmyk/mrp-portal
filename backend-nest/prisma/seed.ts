import { PrismaClient, Role, Category } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Users
  const users = [
    { name: 'System Admin', email: 'admin@mrp.local', role: Role.ADMIN },
    { name: 'Head of Sales - Local', email: 'sales.local@mrp.local', role: Role.SALES_LOCAL },
    { name: 'Head of Sales - Export', email: 'sales.export@mrp.local', role: Role.SALES_EXPORT },
    { name: 'Head of Operations & Production', email: 'ops@mrp.local', role: Role.OPS },
    { name: 'Head of Supply Chain', email: 'supply@mrp.local', role: Role.SUPPLY_CHAIN },
    { name: 'Head of Treasury', email: 'treasury@mrp.local', role: Role.TREASURY },
    { name: 'Head of Finance', email: 'finance@mrp.local', role: Role.FINANCE },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
  }

  // Raw Materials
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

  // Recipes
  await prisma.recipe.upsert({
    where: { itemCode: 'BOPP-20MIC' },
    update: {},
    create: {
      itemCode: 'BOPP-20MIC',
      itemName: 'BOPP Film 20 Micron',
      description: 'General purpose BOPP film',
      category: Category.BOPP,
      normalLoss: 2.5,
      compositions: { create: [{ rawMaterialId: rmPP.id, percentage: 98.5 }] },
    },
  });

  await prisma.recipe.upsert({
    where: { itemCode: 'CPP-25MIC' },
    update: {},
    create: {
      itemCode: 'CPP-25MIC',
      itemName: 'CPP Film 25 Micron',
      description: 'Cast polypropylene film',
      category: Category.CPP,
      normalLoss: 3.0,
      compositions: { create: [{ rawMaterialId: rmPE.id, percentage: 97 }] },
    },
  });

  await prisma.recipe.upsert({
    where: { itemCode: 'BOPET-12MIC' },
    update: {},
    create: {
      itemCode: 'BOPET-12MIC',
      itemName: 'BOPET Film 12 Micron',
      description: 'Polyester film',
      category: Category.BOPET,
      normalLoss: 2.0,
      compositions: { create: [{ rawMaterialId: rmPET.id, percentage: 98 }] },
    },
  });
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
