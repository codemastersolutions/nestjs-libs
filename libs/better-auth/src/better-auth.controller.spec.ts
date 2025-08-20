import { Test, TestingModule } from '@nestjs/testing';
import { BetterAuthController } from './better-auth.controller';
import { BetterAuthService } from './better-auth.service';
import { RateLimiter } from './utils/rate-limiter.util';
import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';
import type { BetterAuthModuleOptions } from './better-auth.types';

describe('BetterAuthController', () => {
  let controller: BetterAuthController;
  let service: BetterAuthService;
  let mockAuth: any;
  let mockOptions: BetterAuthModuleOptions;

  beforeEach(async () => {
    // Mock Better Auth instance
    mockAuth = {
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

    mockOptions = {
      auth: mockAuth as any,
      disableMiddleware: false,
      disableExceptionFilter: false,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetterAuthController],
      providers: [
        BetterAuthService,
        {
          provide: BETTER_AUTH_INSTANCE,
          useValue: mockAuth,
        },
        {
          provide: BETTER_AUTH_OPTIONS,
          useValue: mockOptions,
        },
      ],
    }).compile();

    controller = module.get<BetterAuthController>(BetterAuthController);
    service = module.get<BetterAuthService>(BetterAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('handleAuth', () => {
    it('should handle GET requests', async () => {
      const mockRequest = {
        method: 'GET',
        url: '/api/auth/session',
        headers: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
        end: jest.fn(),
      };
      const mockHandlerResponse = new Response('{}', { status: 200 });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(service.handleRequest).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle POST requests', async () => {
      const mockRequest = {
        method: 'POST',
        url: '/api/auth/sign-in',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
        end: jest.fn(),
      };
      const mockHandlerResponse = new Response('{}', { status: 200 });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(service.handleRequest).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle different auth paths', async () => {
      const mockRequest = {
        method: 'GET',
        url: '/api/auth/callback/google',
        headers: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
        end: jest.fn(),
      };
      const mockHandlerResponse = new Response('{}', { status: 200 });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(service.handleRequest).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      const mockRequest = {
        method: 'POST',
        url: '/api/auth/invalid',
        headers: {},
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
        end: jest.fn(),
      };
      const mockHandlerResponse = new Response('{}', { status: 404 });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(service.handleRequest).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors and throw when exception filter is not disabled', async () => {
      const mockRequest = {
        method: 'POST',
        url: '/api/auth/error',
        headers: { host: 'localhost' },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      const error = new Error('Service error');
      jest.spyOn(service, 'handleRequest').mockRejectedValue(error);
      jest.spyOn(service, 'getOptions').mockReturnValue({ ...mockOptions, disableExceptionFilter: false });

      await expect(controller.handleAuth(mockRequest as any, mockResponse as any, {})).rejects.toThrow('Service error');
    });

    it('should handle service errors and return 500 when exception filter is disabled (Express)', async () => {
      const mockRequest = {
        method: 'POST',
        url: '/api/auth/error',
        headers: { host: 'localhost' },
        originalUrl: '/api/auth/error',
        protocol: 'http',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      const error = new Error('Service error');
      jest.spyOn(service, 'handleRequest').mockRejectedValue(error);
      jest.spyOn(service, 'getOptions').mockReturnValue({ ...mockOptions, disableExceptionFilter: true });

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error');
    });

    it('should handle service errors and return 500 when exception filter is disabled (Fastify)', async () => {
      const mockRequest = {
        method: 'POST',
        url: '/api/auth/error',
        headers: { host: 'localhost' },
      };
      const mockResponse = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      const error = new Error('Service error');
      jest.spyOn(service, 'handleRequest').mockRejectedValue(error);
      jest.spyOn(service, 'getOptions').mockReturnValue({ ...mockOptions, disableExceptionFilter: true });

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(mockResponse.code).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error');
    });

    it('should return 404 when no response from Better Auth (Express)', async () => {
      const mockRequest = {
        method: 'GET',
        url: '/api/auth/nonexistent',
        headers: { host: 'localhost' },
        originalUrl: '/api/auth/nonexistent',
        protocol: 'http',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      jest.spyOn(service, 'handleRequest').mockResolvedValue(undefined as any);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not Found');
    });

    it('should return 404 when no response from Better Auth (Fastify)', async () => {
      const mockRequest = {
        method: 'GET',
        url: '/api/auth/nonexistent',
        headers: { host: 'localhost' },
      };
      const mockResponse = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      jest.spyOn(service, 'handleRequest').mockResolvedValue(undefined as any);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(mockResponse.code).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith('Not Found');
    });
  });

  describe('Response handling', () => {
    it('should handle Fastify responses with body', async () => {
      const mockRequest = {
        method: 'GET',
        url: '/api/auth/session',
        headers: { host: 'localhost' },
      };
      const mockResponse = {
        code: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      const mockHandlerResponse = new Response(JSON.stringify({ user: 'test' }), { 
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(mockResponse.code).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle Fastify responses without body', async () => {
      const mockRequest = {
        method: 'GET',
        url: '/api/auth/session',
        headers: { host: 'localhost' },
      };
      const mockResponse = {
        code: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      const mockHandlerResponse = new Response(null, { 
        status: 204,
        headers: { 'content-type': 'application/json' }
      });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(mockResponse.code).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith('');
    });

    it('should handle requests without host header', async () => {
      const mockRequest = {
        method: 'GET',
        url: '/api/auth/session',
        headers: {},
        originalUrl: '/api/auth/session',
        protocol: 'http',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      const mockHandlerResponse = new Response('{}', { status: 200 });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(service.handleRequest).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle requests without method', async () => {
      const mockRequest = {
        url: '/api/auth/session',
        headers: { host: 'localhost' },
        originalUrl: '/api/auth/session',
        protocol: 'http',
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      const mockHandlerResponse = new Response('{}', { status: 200 });
      jest.spyOn(service, 'handleRequest').mockResolvedValue(mockHandlerResponse);

      await controller.handleAuth(mockRequest as any, mockResponse as any, {});

      expect(service.handleRequest).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});