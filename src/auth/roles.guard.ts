import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token } = request.query;
    const jwtPayload = await this.authService.parseToken(token);

    request.user = jwtPayload;
    return true;
  }
}
