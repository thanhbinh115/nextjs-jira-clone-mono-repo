import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  handleRequest<TUser = unknown | boolean>(
    err: Error,
    user: TUser,
    _info: Error,
    context
  ): TUser {
    const isRpc = context.getType() === 'rpc';
    if (isRpc) {
      return;
    }

    console.log('err: ', err);
    console.log('user: ', user);

    if (err || !user) {
      throw new UnauthorizedException('Refresh token unauthorized');
    }
    return user;
  }
}
