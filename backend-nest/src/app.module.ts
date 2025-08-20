import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { MasterModule } from './master/master.module';
import { PlanModule } from './plan/plan.module';
import { RmModule } from './rm/rm.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [AuthModule, MasterModule, PlanModule, RmModule, ReportModule],
  providers: [PrismaService],
})
export class AppModule {}
