import { Test, TestingModule } from '@nestjs/testing';
import { BetterAuthModule } from './better-auth.module';
import { BetterAuthService } from './better-auth.service';
import { BetterAuthController } from './better-auth.controller';
import { BetterAuthModuleOptions } from './better-auth.types';

describe('BetterAuthModule', () => {
  const mockAuth = {
    handler: jest.fn().mockResolvedValue(new Response('{}', { status: 200 })),
    api: {
      getSession: jest.fn().mockResolvedValue({ session: null, user: null }),
      signOut: jest.fn().mockResolvedValue({ success: true }),
    },
    options: {
      baseURL: 'http://localhost:3000',
      basePath: '/api/auth',
    },
    $ERROR_CODES: {},
    $context: Promise.resolve({}),
  };

  const mockOptions: BetterAuthModuleOptions = {
    auth: mockAuth as any,
    disableMiddleware: false,
    disableExceptionFilter: false,
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

  describe('controller registration', () => {
    it('should register BetterAuthController when module is created', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [BetterAuthModule.forRoot(mockOptions)],
      }).compile();

      const controller = module.get<BetterAuthController>(BetterAuthController);
      expect(controller).toBeDefined();
    });

    it('should register BetterAuthController with async configuration', async () => {
      const factory = jest.fn().mockReturnValue(mockOptions);

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          BetterAuthModule.forRootAsync({
            useFactory: factory,
          }),
        ],
      }).compile();

      const controller = module.get<BetterAuthController>(BetterAuthController);
      expect(controller).toBeDefined();
    });
  });
});
