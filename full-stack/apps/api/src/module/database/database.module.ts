import { Global, Module, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostgresConnectionConfig } from '../../common/config/postgres-connection.config';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: PostgresConnectionConfig,
    }),
  ],
  providers: [Logger],
})
export class DatabaseModule {}
