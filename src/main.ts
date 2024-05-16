import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { initApp } from './app.dependency';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initApp(app);

  await app.listen(8000);
}
bootstrap();
