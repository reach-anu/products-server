import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(5003);
}
bootstrap();
