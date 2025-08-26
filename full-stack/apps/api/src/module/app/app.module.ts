import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import postgresConfig from '../../common/config/postgres.config';
import authConfig from '../../common/config/auth.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';
import { LoggingMiddleware } from '../../common/middleware/logging.middleware';
import { DatabaseModule } from '../database/database.module';
import { HealthModule } from '../health/health.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthJwtAccessStrategy } from '../../common/guard/jwt.access.strategy';
import { AuthJwtRefreshStrategy } from '../../common/guard/jwt.refresh.strategy';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '../../common/filter/exception.filter';
import { ResponseInterceptor } from '../../common/interceptor/response.interceptor';
import { AuthJwtAccessGuard } from '../../common/guard/jwt.access.guard';
import { RolesGuard } from '../../common/guard/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, authConfig],
    }),
    LoggerModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthJwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
