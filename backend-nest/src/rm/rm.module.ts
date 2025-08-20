// backend-nest/src/rm/rm.module.ts
import { Module } from '@nestjs/common';
import { RmController } from './rm.controller';

@Module({
  controllers: [RmController],
  providers: [],
  exports: [],
})
export class RmModule {}
