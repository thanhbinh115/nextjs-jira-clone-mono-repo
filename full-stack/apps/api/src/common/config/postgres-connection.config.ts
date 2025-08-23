import { Injectable, Inject } from '@nestjs/common';
import { PostgresConfig } from '@full-stack/utils';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { AppLogService } from '../../module/logger/app-log.service';

@Injectable()
export class PostgresConnectionConfig implements SequelizeOptionsFactory {
  @Inject()
  configService: ConfigService;

  @Inject()
  logService: AppLogService;

  async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    const postgresConfig =
      this.configService.get<PostgresConfig>('postgresConfig');

    this.logService.log('Begin connect', 'Postgres');

    return {
      dialect: 'postgres',
      host: postgresConfig.host,
      port: postgresConfig.port,
      username: postgresConfig.username,
      password: postgresConfig.password,
      database: postgresConfig.database,
      autoLoadModels: true,
      synchronize: true,
    };
  }
}
