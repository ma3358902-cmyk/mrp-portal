import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('rm')
export class RMController {
  constructor(private prisma: PrismaService) {}

  @Post('availability/:month')
  async upsertAvail(@Param('month') month:string, @Body() body:any){
    const lines = body.lines as any[];
    for (const ln of lines) {
      await this.prisma.rMAvailability.upsert({
        where:{ month_plantId_rmId:{ month, plantId: ln.plantId, rmId: ln.rmId } },
        update:{ openingStock: ln.openingStock||0, purchasesMonth: ln.purchasesMonth||0 },
        create:{ month, plantId: ln.plantId, rmId: ln.rmId, openingStock: ln.openingStock||0, purchasesMonth: ln.purchasesMonth||0 }
      });
    }
    return { ok:true };
  }

  @Get('availability/:month')
  async getAvail(@Param('month') month:string){
    return this.prisma.rMAvailability.findMany({ where:{ month }, include:{ plant:true, rm:true } });
  }
}
