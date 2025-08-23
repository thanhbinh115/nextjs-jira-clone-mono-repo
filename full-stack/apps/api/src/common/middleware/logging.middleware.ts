import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogService } from '../../module/logger/app-log.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: AppLogService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;
      const logMessage = `${method} ${originalUrl} ${statusCode} ${
        contentLength || 0
      } - ${responseTime}ms`;

      this.loggerService.debug(logMessage, 'HTTP');
    });

    next();
  }
}
