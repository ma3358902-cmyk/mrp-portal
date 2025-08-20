import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.auth.login(body.email, body.password);
  }

  @Get('me')
  async me(@Req() req: any) {
    return this.auth.me(req.user?.sub);
  }
}
