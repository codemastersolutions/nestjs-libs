/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { BetterAuthMiddleware } from './better-auth.middleware';
import { BetterAuthService } from './better-auth.service';
import type { BetterAuthModuleOptions } from './better-auth.types';
import { RateLimiter } from './utils/rate-limiter.util';
import { logger } from './utils/logger.util';
import { RequestValidator } from './utils/request-validator.util';

// Mock the logger and RequestValidator
jest.mock('./utils/logger.util');
jest.mock('./utils/request-validator.util');

describe('BetterAuthMiddleware', () => {
  let middleware: BetterAuthMiddleware;
  let mockBetterAuthService: jest.Mocked<BetterAuthService>;
  let mockOptions: BetterAuthModuleOptions;
  let mockNext: jest.Mock;
  let mockResponse: any;
  let consoleErrorSpy: jest.SpyInstance;
  let mockLogger: jest.Mocked<typeof logger>;

  beforeEach(async () => {
    // Mock console.error to suppress security logs during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock logger
    mockLogger = logger as jest.Mocked<typeof logger>;
    mockLogger.debug = jest.fn();
    mockLogger.error = jest.fn();
    
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
    consoleErrorSpy.mockRestore();
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
        headers: { host: 'localhost' },
        protocol: 'http',
        originalUrl: '/api/auth/session',
        get: jest.fn().mockReturnValue('localhost'),
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
        headers: { host: 'localhost' },
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
        headers: { host: 'localhost' },
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
        headers: { host: ['localhost', 'example.com'] },
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
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Authentication error occurred',
        error,
        {
          path: '/api/auth/session',
          method: 'GET',
        },
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
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Authentication error occurred',
        error,
        {
          path: '/api/auth/session',
          method: 'GET',
        },
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
        headers: { host: 'localhost' },
        protocol: 'http',
        originalUrl: '/api/auth/signout',
        get: jest.fn().mockReturnValue('localhost'),
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

    it('should handle request without method (defaults to GET)', async () => {
      const mockRequest = {
        path: '/api/auth/session',
        headers: { host: 'localhost' },
        protocol: 'http',
        originalUrl: '/api/auth/session',
        get: jest.fn().mockReturnValue('localhost'),
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

    it('should handle request without originalUrl (uses url)', async () => {
      const mockRequest = {
        url: '/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost' },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost'),
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

  describe('RequestValidator integration', () => {
    let mockRequestValidator: jest.Mocked<RequestValidator>;

    beforeEach(() => {
      mockRequestValidator = {
        validateHostHeader: jest.fn(),
        validateHeaders: jest.fn(),
        validateRequestBody: jest.fn(),
      } as any;
      
      (RequestValidator as jest.MockedClass<typeof RequestValidator>).mockImplementation(() => mockRequestValidator);
    });

    it('should use RequestValidator for host validation in Fastify requests', async () => {
      const mockRequest = {
        url: '/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost' },
      };

      mockRequestValidator.validateHostHeader.mockReturnValue('localhost');
      mockRequestValidator.validateHeaders.mockReturnValue({ host: 'localhost' });

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(mockWebResponse as any);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(RequestValidator).toHaveBeenCalledWith(mockOptions);
      expect(mockRequestValidator.validateHostHeader).toHaveBeenCalledWith('localhost');
      expect(mockRequestValidator.validateHeaders).toHaveBeenCalledWith({ host: 'localhost' });
    });

    it('should handle RequestValidator errors gracefully in URL parsing', async () => {
      const mockRequest = {
        url: '/api/auth/session?param=value',
        method: 'GET',
        headers: { host: 'invalid-host' },
      };

      // First call (URL parsing) throws error, second call (headers validation) succeeds
      mockRequestValidator.validateHostHeader
        .mockImplementationOnce(() => {
          throw new Error('Invalid host');
        })
        .mockReturnValue('invalid-host');
      mockRequestValidator.validateHeaders.mockReturnValue({ host: 'invalid-host' });

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(mockWebResponse as any);

      await middleware.use(mockRequest, mockResponse, mockNext);

      // Should use fallback URL parsing (split by query params)
      expect(mockBetterAuthService.handleRequest).toHaveBeenCalled();
    });

    it('should validate request body for non-GET requests', async () => {
      const mockRequest = {
        path: '/api/auth/signin',
        method: 'POST',
        headers: { 
          host: 'localhost',
          'content-type': 'application/json'
        },
        protocol: 'http',
        originalUrl: '/api/auth/signin',
        body: { email: 'test@example.com' },
        get: jest.fn().mockReturnValue('localhost'),
      };

      mockRequestValidator.validateHostHeader.mockReturnValue('localhost');
      mockRequestValidator.validateHeaders.mockReturnValue({ 
        host: 'localhost',
        'content-type': 'application/json'
      });
      mockRequestValidator.validateRequestBody.mockReturnValue(JSON.stringify({ email: 'test@example.com' }));

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(mockWebResponse as any);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequestValidator.validateRequestBody).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        'application/json'
      );
    });

    it('should handle array content-type headers', async () => {
      const mockRequest = {
        path: '/api/auth/signin',
        method: 'POST',
        headers: { 
          host: 'localhost',
          'content-type': ['application/json', 'charset=utf-8']
        },
        protocol: 'http',
        originalUrl: '/api/auth/signin',
        body: { email: 'test@example.com' },
        get: jest.fn().mockReturnValue('localhost'),
      };

      mockRequestValidator.validateHostHeader.mockReturnValue('localhost');
      mockRequestValidator.validateHeaders.mockReturnValue({ 
        host: 'localhost',
        'content-type': 'application/json'
      });
      mockRequestValidator.validateRequestBody.mockReturnValue(JSON.stringify({ email: 'test@example.com' }));

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(mockWebResponse as any);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequestValidator.validateRequestBody).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        'application/json'
      );
    });
  });

  describe('Logger integration', () => {
    it('should log debug information for requests', async () => {
      const mockRequest = {
        path: '/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost' },
        protocol: 'http',
        originalUrl: '/api/auth/session',
        get: jest.fn().mockReturnValue('localhost'),
      };

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(logger.debug).toHaveBeenCalledWith('Request received', {
        path: '/api/auth/session',
        url: undefined,
        method: 'GET',
        authPath: '/api/auth',
      });
    });

    it('should log debug information with globalPrefix', async () => {
      mockOptions.globalPrefix = 'v1';
      mockBetterAuthService.getOptions.mockReturnValue(mockOptions);

      const mockRequest = {
        path: '/v1/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost' },
        protocol: 'http',
        originalUrl: '/v1/api/auth/session',
        get: jest.fn().mockReturnValue('localhost'),
      };

      const mockWebResponse = {
        status: 200,
        headers: new Map(),
        text: jest.fn().mockResolvedValue('{}'),
      };

      mockBetterAuthService.handleRequest.mockResolvedValue(mockWebResponse as any);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(logger.debug).toHaveBeenCalledWith('Request received', {
        path: '/v1/api/auth/session',
        url: undefined,
        method: 'GET',
        authPath: '/v1/api/auth',
      });
    });
  });

  describe('Edge cases for error handling', () => {
    it('should handle non-Error objects in catch block', async () => {
      const mockRequest = {
        path: '/api/auth/session',
        method: 'GET',
        headers: { host: 'localhost' },
        protocol: 'http',
        originalUrl: '/api/auth/session',
        get: jest.fn().mockReturnValue('localhost'),
      };

      // Throw a non-Error object
      mockBetterAuthService.handleRequest.mockRejectedValue('String error');

      mockOptions.disableExceptionFilter = true;
      mockBetterAuthService.getOptions.mockReturnValue(mockOptions);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error');
    });
  });
});
