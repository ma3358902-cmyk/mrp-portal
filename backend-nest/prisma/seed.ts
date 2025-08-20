/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Safe upsert for optional models. If the model doesn't exist in your Prisma
 * schema (e.g., no Plant model), this just logs and continues.
 */
async function upsertIfModelExists(
  modelName: string,
  args: { where: any; create: any; update?: any }
) {
  const anyPrisma = prisma as any;
  const model = anyPrisma[modelName];
  if (!model || typeof model.upsert !== 'function') {
    console.log(`[seed] Model '${modelName}' not found. Skipping.`);
    return;
  }
  await model.upsert({
    where: args.where,
    update: args.update ?? {},
    create: args.create,
  });
  console.log(`[seed] Upserted into ${modelName}:`, args.where);
}

async function main() {
  console.log('[seed] Seeding start');

  // 1) Admin user
  const adminEmail = 'admin@mrp.local';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN, // Role enum exists in your schema
      // If your User has 'name' or other fields, add them here as needed:
      // name: 'Admin',
    },
  });
  console.log('[seed] Admin user ready:', adminEmail);

  // 2) Plants (safe even if your schema doesn't have Plant model)
  const plants = [
    { code: 'IPAK', name: 'BOPP Plant - IPAK' },
    { code: 'GPAK', name: 'BOPP Plant - GPAK' },
    { code: 'CPAK', name: 'CPP Plant - CPAK' },
    { code: 'PETAPK', name: 'BOPET Plant - PETAPK' },
  ];

  for (const p of plants) {
    await upsertIfModelExists('plant', {
      where: { code: p.code },
      create: { code: p.code, name: p.name },
      update: {},
    });
  }

  console.log('[seed] Seeding complete');
}

main()
  .catch((e) => {
    console.error('[seed] Error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
