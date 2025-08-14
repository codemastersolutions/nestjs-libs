import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppExpressModule } from './express/app.module';
import { AppFastifyModule } from './fastify/app.module';

const host = '0.0.0.0' as const;

async function bootstrapExpress() {
  const port: number = 3900 as const;
  const app = await NestFactory.create(AppExpressModule);
  await app.listen(port, host, () => {
    console.log(
      `🌱🌱🌱  Express server is running on http://localhost:${port}`,
    );
  });
}

async function bootstrapFastify() {
  const logger = {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  } as const;
  const port: number = 3901 as const;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppFastifyModule,
    new FastifyAdapter({
      logger,
    }),
  );
  await app.listen(port, host, () => {
    console.log(
      `🌿🌿🌿  Fastify server is running on http://localhost:${port}`,
    );
  });
}

bootstrapExpress().catch((err) => {
  console.error(err);
  process.exit(1);
});

bootstrapFastify().catch((err) => {
  console.error(err);
  process.exit(1);
});
