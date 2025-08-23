import { Module, Global, Logger } from '@nestjs/common';
import { AppLogService } from './app-log.service';

@Global()
@Module({
  providers: [AppLogService, Logger],
  exports: [AppLogService],
})
export class LoggerModule {}
