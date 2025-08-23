import { ConfigService } from '@nestjs/config';
import { PostgresConfig } from '@full-stack/utils';

const configService = new ConfigService();

export default (): Record<string, PostgresConfig> => ({
  postgresConfig: {
    username: configService.get<string>('PG_USERNAME'),
    password: configService.get<string>('PG_PASSWORD'),
    host: configService.get<string>('PG_HOST'),
    database: configService.get<string>('PG_DATABASE'),
    port: configService.get<number>('PG_PORT'),
  },
});
