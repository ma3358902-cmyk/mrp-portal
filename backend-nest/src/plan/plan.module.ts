import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PlanController } from './plan.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../auth/jwt.guard';

@Module({
  imports:[JwtModule.register({ secret: process.env.JWT_SECRET || 'dev_secret' })],
  providers:[PrismaService, JwtGuard],
  controllers:[PlanController]
})
export class PlanModule {}
