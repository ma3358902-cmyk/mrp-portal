import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('reports')
export class ReportController {
  constructor(private prisma: PrismaService) {}

  @Get('rm-req/:month')
  async rmReq(@Param('month') month:string){
    const plines = await this.prisma.productionLine.findMany({ where:{ plan:{ month } }, include:{ fg:true } });
    if (!plines.length) return [];
    const fgIds = Array.from(new Set(plines.map(p=>p.fgId)));
    const boms = await this.prisma.bOM.findMany({ where:{ fgId:{ in: fgIds }, status:'ACTIVE' }, include:{ lines:true } });
    const latest = new Map<number, any>();
    for (const b of boms) { const e = latest.get(b.fgId); if (!e || b.version > e.version) latest.set(b.fgId, b); }
    const agg = new Map<number, number>();
    for (const pl of plines) {
      const bom = latest.get(pl.fgId); if (!bom) continue;
      const grossBase = pl.plannedQty / (1 - (bom.normalLossPct || 0));
      for (const ln of bom.lines) {
        const qty = grossBase * (ln.rmPct || 0);
        agg.set(ln.rmId, (agg.get(ln.rmId)||0) + qty);
      }
    }
    const rmIds = Array.from(agg.keys());
    const rms = await this.prisma.rawMaterialItem.findMany({ where:{ id:{ in: rmIds } } });
    const rmMap = new Map(rms.map(r=>[r.id, r]));
    return rmIds.map(id=>({ rmId:id, rmCode: rmMap.get(id)?.code || String(id), requiredQty: agg.get(id)||0 }));
  }

  @Get('demand-vs-supply/:month')
  async dvs(@Param('month') month:string){
    const dlines = await this.prisma.salesDemandLine.findMany({ where:{ plan:{ month } }, include:{ fg:true } });
    const slines = await this.prisma.supplyLine.findMany({ where:{ plan:{ month } }, include:{ fg:true } });
    const demand = new Map<number, number>();
    dlines.forEach(l=> demand.set(l.fgId, (demand.get(l.fgId)||0) + l.backlockQty + l.newOrderQty));
    const supply = new Map<number, number>();
    slines.forEach(l=> supply.set(l.fgId, (supply.get(l.fgId)||0) + l.openingStock + l.productionQty));
    const fgIds = Array.from(new Set([...demand.keys(), ...supply.keys()]));
    const fgs = await this.prisma.finishedGoodItem.findMany({ where:{ id:{ in: fgIds } } });
    const fgMap = new Map(fgs.map(f=>[f.id, f]));
    return fgIds.map(id => ({
      fgId: id,
      code: fgMap.get(id)?.code,
      name: fgMap.get(id)?.name,
      demand: demand.get(id) || 0,
      supply: supply.get(id) || 0,
      gap: (demand.get(id)||0) - (supply.get(id)||0)
    }));
  }
}
