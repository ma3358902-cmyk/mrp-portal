import { Controller, Get } from '@nestjs/common';

@Controller('rm')
export class RmController {
  @Get('availability')
  availability() { return { status: 'Not implemented yet' }; }
}
