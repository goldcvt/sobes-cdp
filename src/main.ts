import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {config} from 'dotenv';
import { HttpExceptionFilter } from './errors.filter';
import { LoggingInterceptor } from './logger';


config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor())
  await app.listen(5656);
}
bootstrap();
