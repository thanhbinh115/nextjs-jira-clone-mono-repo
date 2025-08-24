import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppLogService } from '../../module/logger/app-log.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: AppLogService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException && exception.message
        ? exception.message
        : `http.${HttpStatus.INTERNAL_SERVER_ERROR}`;

    const errorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      message,
    };

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      const errorDetails = {
        ...errorResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
      };
      this.loggerService.error(
        JSON.stringify(errorDetails),
        HttpExceptionFilter.name
      );
    }

    response.status(statusCode).json(errorResponse);
  }
}
