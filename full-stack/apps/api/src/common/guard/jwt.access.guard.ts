import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE_KEY } from '../constant/app.constant';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwt-access') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser = unknown | boolean>(
    err: Error,
    user: TUser,
    _info: Error,
    context
  ): TUser {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ROUTE_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (isPublic) {
      return;
    }

    if (err || !user) {
      throw new UnauthorizedException('auth.accessTokenUnauthorized');
    }

    return user;
  }
}
