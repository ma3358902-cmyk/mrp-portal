import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma, Category, PlantCode } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Controller('master')
export class MasterController {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // Finished Goods (FinishedGood)
  // =========================

  @Get('items')
  async listFinishedGoods() {
    const fgs = await this.prisma.finishedGood.findMany({
      orderBy: { id: 'asc' },
    });

    return fgs.map((fg) => ({
      id: fg.id,
      code: fg.code,
      name: fg.name,
      category: fg.category ?? null,
      subCategory: fg.subCategory ?? null,
      uom: fg.uom,
    }));
  }

  @Post('items')
  async createFinishedGood(
    @Body()
    b: {
      code: string;
      name: string;
      category?: Category | string | null;
      subCategory?: string | null;
      uom?: string | null;
    },
  ) {
    const parsedCategory =
      b.category && Object.values(Category).includes(b.category as Category)
        ? (b.category as Category)
        : null;

    try {
      return await this.prisma.finishedGood.create({
        data: {
          code: b.code,
          name: b.name,
          category: parsedCategory, // nullable enum
          subCategory: b.subCategory ?? null,
          uom: b.uom ?? 'KG',
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new HttpException(
          'A finished good with this code already exists.',
          HttpStatus.CONFLICT,
        );
      }
      throw err;
    }
  }

  // =========================
  // Raw Materials (RawMaterial)
  // =========================

  @Get('raw')
  async listRawMaterials() {
    return this.prisma.rawMaterial.findMany({ orderBy: { id: 'asc' } });
  }

  @Post('raw')
  async createRawMaterial(
    @Body()
    b: {
      code: string;
      name: string;
      uom?: string | null;
      supplier?: string | null;
    },
  ) {
    try {
      return await this.prisma.rawMaterial.create({
        data: {
          code: b.code,
          name: b.name,
          uom: b.uom ?? 'KG',
          supplier: b.supplier ?? null,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new HttpException(
          'A raw material with this code already exists.',
          HttpStatus.CONFLICT,
        );
      }
      throw err;
    }
  }

  // =========================
  // Plants (Plant + PlantCode enum)
  // =========================

  @Get('plants')
  async listPlants() {
    return this.prisma.plant.findMany({ orderBy: { id: 'asc' } });
  }

  @Post('plants')
  async createPlant(@Body() b: { code: PlantCode | string; name: string }) {
    if (!Object.values(PlantCode).includes(b.code as PlantCode)) {
      throw new HttpException(
        `Invalid plant code. Use one of: ${Object.values(PlantCode).join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.prisma.plant.create({
        data: {
          code: b.code as PlantCode,
          name: b.name,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new HttpException(
          'A plant with this code already exists.',
          HttpStatus.CONFLICT,
        );
      }
      throw err;
    }
  }

  // =========================
  // BOMs (BOM/BOMLine)
  // Prisma’s delegate for model `BOM` is `bOM`
  // =========================

  @Get('boms')
  async listBoms() {
    return this.prisma.bOM.findMany({
      include: { fg: true, lines: { include: { rm: true } } },
      orderBy: { id: 'asc' },
    });
  }

  @Post('boms')
  async createBom(
    @Body()
    b: {
      fgCode: string;
      version?: number;
      status?: string; // e.g. 'ACTIVE'
      lines: Array<{ rmCode: string; qty: number }>;
    },
  ) {
    // Resolve FG by code
    const fg = await this.prisma.finishedGood.findUnique({
      where: { code: b.fgCode },
    });
    if (!fg) {
      throw new HttpException('Finished good not found', HttpStatus.BAD_REQUEST);
    }

    // Resolve all RMs by code
    const rmCodes = b.lines.map((l) => l.rmCode);
    const rms = await this.prisma.rawMaterial.findMany({
      where: { code: { in: rmCodes } },
    });

    // Basic guard: all codes must resolve
    const missing = rmCodes.filter(
      (c) => !rms.some((rm) => rm.code === c),
    );
    if (missing.length) {
      throw new HttpException(
        `Unknown raw material code(s): ${missing.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Map lines to `createMany` data
    const linesData = b.lines.map((l) => {
      const rmId = rms.find((rm) => rm.code === l.rmCode)!.id;
      return { rmId, qty: Number(l.qty) || 0 };
    });

    return this.prisma.bOM.create({
      data: {
        fgId: fg.id,
        version: b.version ?? 1,
        status: b.status ?? 'ACTIVE',
        lines: {
          createMany: { data: linesData },
        },
      },
      include: { fg: true, lines: { include: { rm: true } } },
    });
  }
}
