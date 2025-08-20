import { Controller, Get } from '@nestjs/common';

@Controller('plan')
export class PlanController {
  // Temporary stubs; we will re-implement once the new schema is in place
  @Get('sales')
  sales() { return { status: 'Not implemented yet' }; }

  @Get('supply')
  supply() { return { status: 'Not implemented yet' }; }

  @Get('production')
  production() { return { status: 'Not implemented yet' }; }
}
