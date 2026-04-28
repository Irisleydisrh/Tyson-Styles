import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    const errorMessage = typeof message === 'string' ? message : (message as any).message || 'Unknown error';
    const errorName = exception instanceof HttpException ? exception.name : 'InternalServerError';

    this.logger.error(`${request.method} ${request.url} ${status} - ${errorMessage}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json(
      typeof message === 'string'
        ? { statusCode: status, message: errorMessage, error: errorName, timestamp: new Date().toISOString(), path: request.url }
        : { statusCode: status, ...message as object, timestamp: new Date().toISOString(), path: request.url }
    );
  }
}