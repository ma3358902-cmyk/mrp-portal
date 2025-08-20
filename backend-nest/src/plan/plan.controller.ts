import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('plans')
export class PlanController {
  constructor(private prisma: PrismaService) {}

  @Post('demand/:month')
  async upsertDemand(@Param('month') month: string, @Req() req:any, @Body() body:any){
    const market = body.market || 'Local';
    const plan = await this.prisma.salesDemandPlan.upsert({
      where:{ month_market:{ month, market } },
      update:{},
      create:{ month, market, createdBy:req.user.sub }
    });
    await this.prisma.salesDemandLine.deleteMany({ where:{ planId: plan.id } });
    await this.prisma.salesDemandLine.createMany({ data: body.lines.map((l:any)=>({ planId: plan.id, fgId: l.fgId, backlockQty: l.backlockQty||0, newOrderQty: l.newOrderQty||0 })) });
    return { ok:true };
  }

  @Post('supply/:month')
  async upsertSupply(@Param('month') month: string, @Req() req:any, @Body() body:any){
    const plan = await this.prisma.supplyPlan.upsert({ where:{ month }, update:{}, create:{ month, createdBy:req.user.sub } });
    await this.prisma.supplyLine.deleteMany({ where:{ planId: plan.id } });
    await this.prisma.supplyLine.createMany({ data: body.lines.map((l:any)=>({ planId: plan.id, fgId:l.fgId, plantId:l.plantId, openingStock:l.openingStock||0, productionQty:l.productionQty||0 })) });
    return { ok:true };
  }

  @Post('production/:month')
  async upsertProduction(@Param('month') month: string, @Req() req:any, @Body() body:any){
    const plan = await this.prisma.productionPlan.upsert({ where:{ month }, update:{}, create:{ month, createdBy:req.user.sub } });
    await this.prisma.productionLine.deleteMany({ where:{ planId: plan.id } });
    await this.prisma.productionLine.createMany({ data: body.lines.map((l:any)=>({ planId: plan.id, fgId:l.fgId, plantId:l.plantId, plannedQty:l.plannedQty||0 })) });
    return { ok:true };
  }

  @Get('supply/:month')
  async getSupply(@Param('month') month: string){
    return this.prisma.supplyPlan.findUnique({ where:{ month }, include:{ lines:{ include:{ fg:true, plant:true } } } });
  }
}
