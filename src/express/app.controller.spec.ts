import { Test, TestingModule } from '@nestjs/testing';
import { AppExpressController } from './app.controller';
import { AppExpressService } from './app.service';

describe('AppExpressController', () => {
  let appController: AppExpressController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppExpressController],
      providers: [AppExpressService],
    }).compile();

    appController = app.get<AppExpressController>(AppExpressController);
  });

  describe('root', () => {
    it('should return "Hello World from Express!"', () => {
      expect(appController.getHello()).toBe('Hello World from Express!');
    });
  });
});
