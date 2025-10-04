import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'], // Allow requests from frontend on any common port
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
