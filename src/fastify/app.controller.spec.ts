import { Test, TestingModule } from '@nestjs/testing';
import { AppFastifyController } from './app.controller';
import { AppFastifyService } from './app.service';

describe('AppFastifyController', () => {
  let appController: AppFastifyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppFastifyController],
      providers: [AppFastifyService],
    }).compile();

    appController = app.get<AppFastifyController>(AppFastifyController);
  });

  describe('root', () => {
    it('should return "Hello World from Fastify!"', () => {
      expect(appController.getHello()).toBe('Hello World from Fastify!');
    });
  });
});
