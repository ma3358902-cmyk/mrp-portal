import { PrismaClient, Role, Category, PlantCode } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const salt = bcrypt.genSaltSync(10);
  await prisma.user.createMany({
    data: [
      { name:'Admin', email:'admin@mrp.local', passwordHash:bcrypt.hashSync('admin123', salt), role:'ADMIN' as Role },
      { name:'Sales Local', email:'sales.local@mrp.local', passwordHash:bcrypt.hashSync('sales123', salt), role:'SALES_LOCAL' as Role },
      { name:'Ops', email:'ops@mrp.local', passwordHash:bcrypt.hashSync('ops123', salt), role:'OPS' as Role },
      { name:'Supply Chain', email:'sc@mrp.local', passwordHash:bcrypt.hashSync('sc123', salt), role:'SUPPLY_CHAIN' as Role }
    ],
    skipDuplicates: true
  });

  await prisma.plant.createMany({
    data: [
      { code:'IPAK' as PlantCode, type:'BOPP' as Category },
      { code:'GPAK' as PlantCode, type:'BOPP' as Category },
      { code:'CPAK' as PlantCode, type:'CPP' as Category },
      { code:'PETPAK' as PlantCode, type:'BOPET' as Category }
    ],
    skipDuplicates: true
  });

  const rmPP = await prisma.rawMaterialItem.upsert({ where:{ code:'RM-PP' }, update:{}, create:{ code:'RM-PP', name:'Polypropylene (PP)'} });
  const rmPE = await prisma.rawMaterialItem.upsert({ where:{ code:'RM-PE' }, update:{}, create:{ code:'RM-PE', name:'Polyethylene (PE)'} });
  const rmADD = await prisma.rawMaterialItem.upsert({ where:{ code:'RM-ADD' }, update:{}, create:{ code:'RM-ADD', name:'Additives'} });

  const bopp = await prisma.finishedGoodItem.upsert({ where:{ code:'BOPP-20-MT' }, update:{}, create:{ code:'BOPP-20-MT', name:'BOPP Metallized 20µ', category:'BOPP', subCategory:'Metallized', uom:'KG' } });
  const cpp  = await prisma.finishedGoodItem.upsert({ where:{ code:'CPP-25-TR' }, update:{}, create:{ code:'CPP-25-TR', name:'CPP Transparent 25µ', category:'CPP', subCategory:'Transparent', uom:'KG' } });
  const pet  = await prisma.finishedGoodItem.upsert({ where:{ code:'BOPET-12-TR' }, update:{}, create:{ code:'BOPET Transparent 12µ', category:'BOPET', subCategory:'Transparent', uom:'KG' } });

  async function mkBom(fgId:number){
    return prisma.bOM.create({
      data:{
        fgId, version:1, normalLossPct:0.02, effectiveFrom:new Date(),
        lines:{ create:[
          { rmId:rmPP.id, rmPct:0.85 },
          { rmId:rmPE.id, rmPct:0.10 },
          { rmId:rmADD.id, rmPct:0.03 }
        ]}
      }
    });
  }
  await mkBom(bopp.id); await mkBom(cpp.id); await mkBom(pet.id);
  console.log('Seeded users, plants, items, BOMs');
}
main().finally(()=>prisma.$disconnect());
