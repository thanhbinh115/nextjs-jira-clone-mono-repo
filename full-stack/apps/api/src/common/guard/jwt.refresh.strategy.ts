import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from '@full-stack/utils';
import { AuthConfig } from '../config/config.type';

@Injectable()
export class AuthJwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(private readonly configService: ConfigService) {
    const authConfig = configService.get<AuthConfig>('authConfig');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.refreshToken.secret,
    });
  }

  async validate(payload: AuthPayload) {
    return payload;
  }
}
