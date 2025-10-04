import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  // Enable CORS for website AND Chrome extension
  app.enableCors({
    origin: [
      'http://localhost:3001',           // Local frontend
      'http://localhost:3002',           // Alternative frontend port
      'http://localhost:3000',           // Backend itself
      /^chrome-extension:\/\//,          // Chrome extensions (QuickVid extension)
      // Add your production frontend URL here when deploying:
      // 'https://quickvid.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log('✅ CORS enabled for Chrome extensions');
}
bootstrap();
