import { NestFactory } from '@nestjs/core';
import { AppExpressModule } from './express/app.module';
import { AppFastifyModule } from './fastify/app.module';

async function bootstrap() {
  const appExpress = await NestFactory.create(AppExpressModule);
  await appExpress.listen(3900, '0.0.0.0');
  const appFastify = await NestFactory.create(AppFastifyModule);
  await appFastify.listen(3901, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
