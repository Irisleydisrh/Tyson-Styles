import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './config/database/prisma.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  // Run migrations automatically on startup
  try {
    await prismaService.$connect();
    logger.log('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
  }

  // CORS configuration - production ready
  app.enableCors({
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',') 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Add CSP headers middleware
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isProduction = process.env.NODE_ENV === 'production';
  app.use((req: any, res: any, next: any) => {
    // More restrictive CSP in production
    const csp = isProduction
      ? "script-src 'self'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:;"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https:;";
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  // Global pipes and filters - allow extra fields for flexibility
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    forbidNonWhitelisted: false,  // Allow extra fields to avoid validation errors
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Note: Throttler is applied via useClass in app.module
  //app.useGlobalGuards(new ThrottlerGuard());

  // Serve uploaded files statically
  app.use('/uploads', require('express').static('uploads'));

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Backend running on port ${port}`);
  logger.log(`📚 API: http://localhost:${port}/api`);
}
bootstrap();