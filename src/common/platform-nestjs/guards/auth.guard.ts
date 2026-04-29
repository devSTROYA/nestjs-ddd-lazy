import { JwtClaims, USER_CONTEXT_KEY } from '@common/types';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('NO_TOKEN_PROVIDED');
    }

    if (token.startsWith('Bearer ')) {
      const [_, accessToken] = token.split(' ');
      try {
        const payload: JwtClaims = await this.jwtService.verifyAsync(accessToken);
        this.clsService.set(USER_CONTEXT_KEY, { id: payload.sub });
        return true;
      } catch (error) {
        throw new UnauthorizedException('INVALID_TOKEN');
      }
    }

    throw new UnauthorizedException('INVALID_TOKEN_FORMAT');
  }
}
