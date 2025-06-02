import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: [
      'http://localhost:3001', // Next.js dev
      'http://localhost:8081', // React Native dev
      'exp://localhost:8081', // Expo
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Préfixe global pour l'API
  app.setGlobalPrefix('api/v1');

  // Pipes de validation globaux
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtre d'exception global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Récupération du port depuis la configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Application démarrée sur http://localhost:${port}/api/v1`);
}

bootstrap();
