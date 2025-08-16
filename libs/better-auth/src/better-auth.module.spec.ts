/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { BetterAuthModule } from './better-auth.module';
import { BetterAuthService } from './better-auth.service';
import type { BetterAuthModuleOptions } from './better-auth.types';

describe('BetterAuthModule', () => {
  let mockAuth: any;
  let mockOptions: BetterAuthModuleOptions;

  beforeEach(() => {
    mockAuth = {
      handler: jest.fn(),
      api: {
        getSession: jest.fn(),
        signOut: jest.fn(),
      },
      options: {},
      $ERROR_CODES: {},
      $context: {},
    };

    mockOptions = {
      auth: mockAuth,
      disableMiddleware: false,
      disableExceptionFilter: false,
    };
  });

  describe('forRoot', () => {
    it('should create module with provided options', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [BetterAuthModule.forRoot(mockOptions)],
      }).compile();

      const service = module.get<BetterAuthService>(BetterAuthService);
      expect(service).toBeDefined();
      expect(service.getAuth()).toBe(mockAuth);
    });

    it('should work with disableMiddleware: true', async () => {
      const optionsWithDisabledMiddleware = {
        ...mockOptions,
        disableMiddleware: true,
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [BetterAuthModule.forRoot(optionsWithDisabledMiddleware)],
      }).compile();

      const service = module.get<BetterAuthService>(BetterAuthService);
      expect(service).toBeDefined();
      expect(service.getOptions().disableMiddleware).toBe(true);
    });
  });

  describe('forRootAsync', () => {
    it('should work with useFactory', async () => {
      const factory = jest.fn().mockReturnValue(mockOptions);

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          BetterAuthModule.forRootAsync({
            useFactory: factory,
          }),
        ],
      }).compile();

      expect(factory).toHaveBeenCalled();
      const service = module.get<BetterAuthService>(BetterAuthService);
      expect(service).toBeDefined();
    });

    it('should work with useClass', async () => {
      class ConfigService {
        createBetterAuthOptions(): BetterAuthModuleOptions {
          return mockOptions;
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          BetterAuthModule.forRootAsync({
            useClass: ConfigService,
          }),
        ],
      }).compile();

      const service = module.get<BetterAuthService>(BetterAuthService);
      expect(service).toBeDefined();
    });
  });
});
