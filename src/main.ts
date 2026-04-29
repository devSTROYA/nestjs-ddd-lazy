import { HttpFilter } from '@common/platform-nestjs';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const adapter = new ExpressAdapter();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter);

  app.useGlobalFilters(new HttpFilter());
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
