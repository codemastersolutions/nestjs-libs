import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { BetterAuthService, AuthGuard } from '../../libs/better-auth/src';
import { AppExpressController } from './app.controller';
import { AppExpressService } from './app.service';

describe('AppExpressController', () => {
  let appController: AppExpressController;

  beforeEach(async () => {
    const mockBetterAuthService = {
      getSession: jest.fn().mockResolvedValue({ session: null, user: null }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppExpressController],
      providers: [
        AppExpressService,
        {
          provide: BetterAuthService,
          useValue: mockBetterAuthService,
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        Reflector,
      ],
    }).compile();

    appController = app.get<AppExpressController>(AppExpressController);
  });

  describe('root', () => {
    it('should return "Hello World from Express!"', () => {
      expect(appController.getHello()).toBe('Hello World from Express!');
    });
  });
});
