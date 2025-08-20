import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const parts = String(auth).split(' ');
    const token = parts.length === 2 ? parts[1] : null;
    if (!token) throw new UnauthorizedException();
    const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'dev_secret' });
    req.user = payload;
    return true;
  }
}
