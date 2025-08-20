import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { BetterAuthService, AuthGuard } from '../../libs/better-auth/src';
import { AppFastifyController } from './app.controller';
import { AppFastifyService } from './app.service';

describe('AppFastifyController', () => {
  let appController: AppFastifyController;

  beforeEach(async () => {
    const mockBetterAuthService = {
      getSession: jest.fn().mockResolvedValue({ session: null, user: null }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppFastifyController],
      providers: [
        AppFastifyService,
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

    appController = app.get<AppFastifyController>(AppFastifyController);
  });

  describe('root', () => {
    it('should return "Hello World from Fastify!"', () => {
      expect(appController.getHello()).toBe('Hello World from Fastify!');
    });
  });
});
