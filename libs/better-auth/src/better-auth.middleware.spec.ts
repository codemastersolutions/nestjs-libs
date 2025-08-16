/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { BetterAuthMiddleware } from './better-auth.middleware';
import { BetterAuthService } from './better-auth.service';
import type { BetterAuthModuleOptions } from './better-auth.types';

describe('BetterAuthMiddleware', () => {
  let middleware: BetterAuthMiddleware;
  let mockBetterAuthService: jest.Mocked<BetterAuthService>;
  let mockOptions: BetterAuthModuleOptions;
  let mockNext: jest.Mock;
  let mockResponse: any;

  beforeEach(async () => {
    // Mock options
    mockOptions = {
      auth: {
        handler: jest.fn(),
        api: { getSession: jest.fn(), signOut: jest.fn() },
        options: {},
        $ERROR_CODES: {},
        $context: {},
      } as any,
      disableMiddleware: false,
      disableExceptionFilter: false,
    };

    // Mock BetterAuthService
    mockBetterAuthService = {
      getOptions: jest.fn().mockReturnValue(mockOptions),
      handleRequest: jest.fn(),
      getAuth: jest.fn(),
      getSession: jest.fn(),
      signOut: jest.fn(),
    } as any;

    // Mock response object
    mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      end: jest.fn(),
    };

    // Mock next function
    mockNext = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetterAuthMiddleware,
        {
          provide: BetterAuthService,
          useValue: mockBetterAuthService,
        },
      ],
    }).compile();

    middleware = module.get<BetterAuthMiddleware>(BetterAuthMiddleware);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should be defined', () => {
      expect(middleware).toBeDefined();
    });
  });

  describe('Express request handling', () => {
    it('should handle Express auth requests', async () => {
      const mockRequest = {
        path: '/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost:3000' },
        protocol: 'http',
        originalUrl: '/api/auth/session',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      const mockWebResponse = {
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        text: jest.fn().mockResolvedValue('{"user":null}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(
        mockWebResponse as any,
      );

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockBetterAuthService.handleRequest).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'content-type',
        'application/json',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass through non-auth requests', async () => {
      const mockRequest = {
        path: '/api/users',
        method: 'GET',
        headers: { host: 'localhost:3000' },
      };

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockBetterAuthService.handleRequest).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Fastify request handling', () => {
    it('should handle Fastify auth requests', async () => {
      const mockRequest = {
        url: '/api/auth/session?test=1',
        method: 'POST',
        headers: { host: 'localhost:3001' },
        body: { email: 'test@example.com' },
      };

      const mockWebResponse = {
        status: 201,
        headers: new Map([['set-cookie', 'session=abc123']]),
        text: jest.fn().mockResolvedValue('{"success":true}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(
        mockWebResponse as any,
      );

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockBetterAuthService.handleRequest).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'set-cookie',
        'session=abc123',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle Fastify requests with array headers', async () => {
      const mockRequest = {
        url: '/api/auth/signin',
        method: 'POST',
        headers: { host: ['localhost:3001', 'example.com'] },
      };

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(
        mockWebResponse as any,
      );

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockBetterAuthService.handleRequest).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Global prefix handling', () => {
    it('should handle requests with global prefix', async () => {
      mockOptions.globalPrefix = 'v1';
      mockBetterAuthService.getOptions.mockReturnValue(mockOptions);

      const mockRequest = {
        path: '/v1/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost:3000' },
        protocol: 'http',
        originalUrl: '/v1/api/auth/session',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(
        mockWebResponse as any,
      );

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockBetterAuthService.handleRequest).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock console.error to avoid log pollution during tests
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when disableExceptionFilter is false', async () => {
      const mockRequest = {
        path: '/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost:3000' },
        protocol: 'http',
        originalUrl: '/api/auth/session',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      const error = new Error('Auth error');
      mockBetterAuthService.handleRequest.mockRejectedValue(error);

      await expect(
        middleware.use(mockRequest, mockResponse, mockNext),
      ).rejects.toThrow('Auth error');

      // Verify that error was logged for security purposes
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[BetterAuthMiddleware] Authentication error: Error',
      );
    });

    it('should return 500 error when disableExceptionFilter is true', async () => {
      mockOptions.disableExceptionFilter = true;
      mockBetterAuthService.getOptions.mockReturnValue(mockOptions);

      const mockRequest = {
        path: '/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost:3000' },
        protocol: 'http',
        originalUrl: '/api/auth/session',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      const error = new Error('Auth error');
      mockBetterAuthService.handleRequest.mockRejectedValue(error);

      await expect(
        middleware.use(mockRequest, mockResponse, mockNext),
      ).resolves.not.toThrow();

      expect(mockResponse.status).toHaveBeenCalledWith(500);

      // Verify that error was logged for security purposes
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[BetterAuthMiddleware] Authentication error: Error',
      );
      expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error');
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('URL parsing edge cases', () => {
    it('should handle malformed URLs gracefully', async () => {
      const mockRequest = {
        url: '/api/auth/session?invalid=%%',
        method: 'GET',
        headers: { host: 'localhost:3000' },
      };

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(
        mockWebResponse as any,
      );

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockBetterAuthService.handleRequest).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle requests without host header', async () => {
      const mockRequest = {
        url: '/api/auth/session',
        method: 'GET',
        headers: {},
      };

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(
        mockWebResponse as any,
      );

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockBetterAuthService.handleRequest).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Response handling', () => {
    it('should handle response without body', async () => {
      const mockRequest = {
        path: '/api/auth/signout',
        method: 'POST',
        headers: { host: 'localhost:3000' },
        protocol: 'http',
        originalUrl: '/api/auth/signout',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      const mockWebResponse = {
        status: 204,
        headers: new Map(),
        body: null,
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(
        mockWebResponse as any,
      );

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.end).toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });
  });
});
