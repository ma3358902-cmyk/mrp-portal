import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('master')
export class MasterController {
  constructor(private prisma: PrismaService) {}

  @Get('items') async items() { return this.prisma.finishedGoodItem.findMany({ orderBy: { id: 'asc' } }); }
  @Post('items') async addItem(@Body() b:any){
    return this.prisma.finishedGoodItem.create({ data:{ code:b.code, name:b.name, category:b.category, subCategory:b.subCategory, uom:b.uom||'KG' } });
  }

  @Get('raw') async raw() { return this.prisma.rawMaterialItem.findMany({ orderBy: { id:'asc' } }); }
  @Post('raw') async addRaw(@Body() b:any){
    return this.prisma.rawMaterialItem.create({ data:{ code:b.code, name:b.name, uom:b.uom||'KG', supplier:b.supplier||null } });
  }

  @Get('plants') async plants() { return this.prisma.plant.findMany({ orderBy: { id:'asc' } }); }

  @Get('boms') async boms() {
    return this.prisma.bOM.findMany({ include:{ fg:true, lines:{ include:{ rm:true } } }, orderBy:{ id:'asc' } });
  }
  @Post('boms') async addBom(@Body() b:any){
    const existing = await this.prisma.bOM.findFirst({ where:{ fgId:b.fgId, status:'ACTIVE' }, orderBy:{ version:'desc' } });
    const version = existing ? existing.version + 1 : 1;
    return this.prisma.bOM.create({
      data:{
        fgId:b.fgId, version, normalLossPct: b.normalLossPct ?? 0, effectiveFrom:new Date(),
        lines:{ create: b.lines.map((l:any)=>({ rmId:l.rmId, rmPct:l.rmPct })) }
      }
    });
  }
}
