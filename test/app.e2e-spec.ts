import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppExpressModule } from './../src/express/app.module';
import { AppFastifyModule } from './../src/fastify/app.module';

const adapter = process.env.ADAPTER || 'express';
const AppModule = adapter === 'fastify' ? AppFastifyModule : AppExpressModule;
const expectedMessage =
  adapter === 'fastify'
    ? 'Hello World from Fastify!'
    : 'Hello World from Express!';

describe(`AppController (e2e) - ${adapter}`, () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(expectedMessage);
  });
});
