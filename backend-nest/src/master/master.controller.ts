import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('master')
export class MasterController {
  constructor(private readonly prisma: PrismaService) {}

  // Finished goods -> map to our Recipe
  @Get('items')
  async items() {
    const recipes = await this.prisma.recipe.findMany({ orderBy: { id: 'asc' } });
    // shape to a simpler “item” view
    return recipes.map(r => ({
      code: r.itemCode,
      name: r.itemName,
      category: r.category,
      description: r.description,
      normalLoss: r.normalLoss,
    }));
  }

  @Post('items')
  async createItem(@Body() b: any) {
    // minimal create for Recipe
    return this.prisma.recipe.create({
      data: {
        itemCode: b.code,
        itemName: b.name,
        description: b.description ?? null,
        category: b.category,        // must be one of: 'BOPP' | 'CPP' | 'BOPET'
        normalLoss: b.normalLoss ?? 0,
      },
    });
  }

  // Raw-materials -> RawMaterial
  @Get('raw')
  async raw() {
    return this.prisma.rawMaterial.findMany({ orderBy: { id: 'asc' } });
  }

  @Post('raw')
  async createRaw(@Body() b: any) {
    return this.prisma.rawMaterial.create({
      data: {
        code: b.code,
        name: b.name,
        description: b.description ?? null,
        supplier: b.supplier ?? null,
      },
    });
  }

  // Plants — not yet modeled; return a simple static list for now
  @Get('plants')
  async plants() {
    return [
      { id: 1, code: 'IPAK', name: 'IPAK' },
      { id: 2, code: 'GPAK', name: 'GPAK' },
      { id: 3, code: 'CPAK', name: 'CPAK' },
      { id: 4, code: 'PETPAK', name: 'PETPAK' },
    ];
  }
}
