import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET,POST,PUT,DELETE,OPTIONS'
  });
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log('Backend running on port', port);
}
bootstrap();
