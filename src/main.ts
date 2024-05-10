import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import { ExceptionBuilder } from './util/exception-builder.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return ExceptionBuilder.build(validationErrors.map((error) => Object.values(error.constraints).toString()), 400);
      },
    })
  );

  // This will enable the class-validator to use the NestJS DI container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
