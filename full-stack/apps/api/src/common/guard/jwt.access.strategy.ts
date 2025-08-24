import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from '@full-stack/utils';
import { AuthConfig } from '../config/config.type';

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor(private readonly configService: ConfigService) {
    const authConfig = configService.get<AuthConfig>('authConfig');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.accessToken.secret,
    });
  }

  async validate(payload: AuthPayload) {
    return payload;
  }
}
