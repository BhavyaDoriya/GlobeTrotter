import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes prefixed with /api
  app.setGlobalPrefix('api');

  // Allow Next.js dev server
  app.enableCors({
    origin: process.env.WEB_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Strip unknown fields, auto-transform types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Never send stack traces to clients
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger at /api/docs
  const config = new DocumentBuilder()
    .setTitle('GlobeTrotter API')
    .setDescription('Backend API for the GlobeTrotter travel planning app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`\n🌍 API running    → http://localhost:${port}`);
  console.log(`📄 Swagger docs  → http://localhost:${port}/api/docs\n`);
}

bootstrap();
