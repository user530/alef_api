import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import * as YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Resolve path and load document
  const documentPath = join(__dirname, '..', 'assets', 'openapi-spec.yaml');
  const swaggerDocument = YAML.load(documentPath);

  // Serve documentation
  SwaggerModule.setup('/', app, swaggerDocument);

  await app.listen(process.env.API_PORT);
}
bootstrap();
