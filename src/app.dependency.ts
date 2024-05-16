import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import { ExceptionBuilder } from './util/exception-builder.utils';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { AppModule } from './app.module';

function initApp(app: INestApplication<any>){

    app.setGlobalPrefix("api");
    app.enableCors({
      origin: `${process.env.APP_URL}`,
      credentials: true,
    });
  
    app.use(cookieParser());
  
    app.use(
      session({
        name: 'session_id',
        cookie: {maxAge: 1000 * 60 * 30}, //30 minute session expire
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    );
  
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
}

export {initApp}