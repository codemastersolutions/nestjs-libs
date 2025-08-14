/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppExpressModule } from './express/app.module';
import { AppFastifyModule } from './fastify/app.module';

const host = '0.0.0.0' as const;

const swagger = (app: INestApplication) => {
  const swaggerConfig: any = new DocumentBuilder()
    .setTitle('NestJS Libs')
    .setVersion('1.0')
    .setDescription('NestJS Libs API')
    .addBearerAuth()
    .build();
  const swaggerDocument = (app: INestApplication) =>
    SwaggerModule.createDocument(app, swaggerConfig);
  const document = swaggerDocument(app);
  const scalarOptions: any = {
    withFastify: true,
    content: document,
    config: {
      authentication: {
        preferredSecurityScheme: 'httpBearer',
        securitySchemes: {
          httpBearer: {
            token: 'xyz token value',
          },
        },
      },
    },
    theme: 'elysiajs',
    hideDownloadButton: true,
    darkMode: true,
    title: `NestJS Libs`,
    operationsSorter: 'method',
    tagsSorter: 'alpha',
  };
  app.use('/reference', apiReference(scalarOptions));
  // return SwaggerModule.setup('api', app, document);
};

async function bootstrapExpress() {
  const port: number = 3900 as const;
  const app = await NestFactory.create(AppExpressModule);
  swagger(app);
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
  swagger(app);
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
