import { NestFactory } from '@nestjs/core';
import { AppModule } from './express/app.module';

async function bootstrap() {
  const appExpress = await NestFactory.create(AppModule);
  await appExpress.listen(3900, '0.0.0.0');
  const appFastify = await NestFactory.create(AppModule);
  await appFastify.listen(3901, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
