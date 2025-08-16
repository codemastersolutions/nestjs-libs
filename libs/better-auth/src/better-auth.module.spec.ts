import { Test, TestingModule } from '@nestjs/testing';
import { BetterAuthModule } from './better-auth.module';
import { BetterAuthService } from './better-auth.service';
import { BetterAuthMiddleware } from './better-auth.middleware';
import { BetterAuthModuleOptions } from './better-auth.types';

describe('BetterAuthModule', () => {
  const mockAuth = {
    handler: jest.fn(),
    api: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
    options: {},
    $ERROR_CODES: {},
    $context: {},
  };

  const mockOptions: BetterAuthModuleOptions = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    auth: mockAuth as any,
  };

  describe('forRoot', () => {
    it('should create module with provided options', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [BetterAuthModule.forRoot(mockOptions)],
      }).compile();

      const service = module.get<BetterAuthService>(BetterAuthService);
      expect(service).toBeDefined();
    });

    it('should create module with disableMiddleware option', async () => {
      const optionsWithDisabledMiddleware = {
        ...mockOptions,
        disableMiddleware: true,
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [BetterAuthModule.forRoot(optionsWithDisabledMiddleware)],
      }).compile();

      const service = module.get<BetterAuthService>(BetterAuthService);
      expect(service).toBeDefined();
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

    it('should work with imports option', async () => {
      const factory = jest.fn().mockReturnValue(mockOptions);
      const mockImportModule = {
        module: class TestModule {},
        providers: [],
        exports: [],
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          BetterAuthModule.forRootAsync({
            useFactory: factory,
            imports: [mockImportModule],
          }),
        ],
      }).compile();

      const service = module.get<BetterAuthService>(BetterAuthService);
      expect(service).toBeDefined();
    });
  });

  describe('middleware configuration', () => {
    it('should configure middleware when disableMiddleware is false', () => {
      const mockConsumer = {
        apply: jest.fn().mockReturnThis(),
        forRoutes: jest.fn(),
      };

      // Set moduleOptions with disableMiddleware: false
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (BetterAuthModule as any).moduleOptions = {
        ...mockOptions,
        disableMiddleware: false,
      };

      const moduleInstance = new BetterAuthModule();
      moduleInstance.configure(mockConsumer as any);

      expect(mockConsumer.apply).toHaveBeenCalledWith(BetterAuthMiddleware);
      expect(mockConsumer.forRoutes).toHaveBeenCalled();
    });

    it('should not configure middleware when disableMiddleware is true', () => {
      const mockConsumer = {
        apply: jest.fn().mockReturnThis(),
        forRoutes: jest.fn(),
      };

      // Set moduleOptions with disableMiddleware: true
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (BetterAuthModule as any).moduleOptions = {
        ...mockOptions,
        disableMiddleware: true,
      };

      const moduleInstance = new BetterAuthModule();
      moduleInstance.configure(mockConsumer as any);

      expect(mockConsumer.apply).not.toHaveBeenCalled();
      expect(mockConsumer.forRoutes).not.toHaveBeenCalled();
    });

    it('should configure middleware when moduleOptions is undefined (default behavior)', () => {
      const mockConsumer = {
        apply: jest.fn().mockReturnThis(),
        forRoutes: jest.fn(),
      };

      // Reset moduleOptions to undefined
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (BetterAuthModule as any).moduleOptions = undefined;

      const moduleInstance = new BetterAuthModule();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      moduleInstance.configure(mockConsumer as any);

      expect(mockConsumer.apply).toHaveBeenCalledWith(BetterAuthMiddleware);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect(mockConsumer.forRoutes).toHaveBeenCalledWith(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { path: 'api/auth', method: expect.any(Number) },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { path: 'api/auth/*path', method: expect.any(Number) },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { path: '/api/auth', method: expect.any(Number) },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { path: '/api/auth/*path', method: expect.any(Number) },
      );
    });
  });
});
