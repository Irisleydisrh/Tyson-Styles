import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse<Response>();
          const statusCode = response.statusCode;
          const duration = Date.now() - startTime;
          const size = data ? JSON.stringify(data).length : 0;
          this.logger.log(`${method} ${url} ${statusCode} ${duration}ms ${size}b - ${userAgent} - ${ip}`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(`${method} ${url} ${error.status || 500} ${duration}ms - ${userAgent} - ${ip} - ${error.message}`);
        },
      }),
    );
  }
}