import { ConfigService } from '@nestjs/config';
import { AuthConfig } from './config.type';
import ms from 'ms';

function seconds(msValue: ms.StringValue) {
  return ms(msValue) / 1000;
}

const configService = new ConfigService();

export default (): Record<string, AuthConfig> => ({
  authConfig: {
    accessToken: {
      secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
      expirationTime: seconds('1d'),
    },
    refreshToken: {
      secret: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expirationTime: seconds('7d'),
    },
  },
});
