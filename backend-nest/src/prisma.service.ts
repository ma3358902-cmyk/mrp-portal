// backend-nest/src/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Call this once in your bootstrap after creating the Nest app:
   *   const app = await NestFactory.create(AppModule);
   *   const prisma = app.get(PrismaService);
   *   await prisma.enableShutdownHooks(app);
   */
  async enableShutdownHooks(app: INestApplication) {
    // cast to any to avoid stricter event typings in some Prisma versions
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
