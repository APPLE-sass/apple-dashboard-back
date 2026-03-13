// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // CORS
  app.enableCors({
    origin: '*',  // ✅ string directo
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // ⚠️ con origin: '*', credentials DEBE ser false
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 Apple Stock API corriendo en: http://localhost:${port}`);
}

bootstrap();