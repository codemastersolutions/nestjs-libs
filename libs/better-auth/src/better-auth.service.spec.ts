/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';
import { BetterAuthService } from './better-auth.service';
import type { BetterAuthModuleOptions } from './better-auth.types';

describe('BetterAuthService', () => {
  let service: BetterAuthService;
  let mockAuth: any;
  let mockOptions: BetterAuthModuleOptions;

  beforeEach(async () => {
    // Mock Better Auth instance
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

    // Mock module options
    mockOptions = {
      auth: mockAuth,
      disableMiddleware: false,
      disableExceptionFilter: false,
    };

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<BetterAuthService>(BetterAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return the auth instance', () => {
      const auth = service.getAuth();
      expect(auth).toBe(mockAuth);
    });

    it('should return the module options', () => {
      const options = service.getOptions();
      expect(options).toBe(mockOptions);
    });
  });

  describe('handleRequest', () => {
    it('should call auth.handler with the request', async () => {
      const mockRequest = new Request('http://localhost:3000/api/auth/session');
      const mockResponse = new Response('success');
      mockAuth.handler.mockResolvedValue(mockResponse);

      const result = await service.handleRequest(mockRequest);

      expect(mockAuth.handler).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });

    it('should handle errors from auth.handler', async () => {
      const mockRequest = new Request('http://localhost:3000/api/auth/session');
      const error = new Error('Auth handler error');
      mockAuth.handler.mockRejectedValue(error);

      await expect(service.handleRequest(mockRequest)).rejects.toThrow(
        'Auth handler error',
      );
    });
  });

  describe('getSession', () => {
    it('should call auth.api.getSession with headers', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer token123',
          'user-agent': 'test-agent',
        },
      };
      const mockSession = { user: { id: '1', email: 'test@example.com' } };
      mockAuth.api.getSession.mockResolvedValue(mockSession);

      const result = await service.getSession(mockRequest);

      expect(mockAuth.api.getSession).toHaveBeenCalledWith({
        headers: mockRequest.headers,
      });
      expect(result).toBe(mockSession);
    });

    it('should handle array headers', async () => {
      const mockRequest = {
        headers: {
          authorization: ['Bearer token123'],
          'user-agent': 'test-agent',
        },
      };
      const mockSession = { user: { id: '1', email: 'test@example.com' } };
      mockAuth.api.getSession.mockResolvedValue(mockSession);

      const result = await service.getSession(mockRequest);

      expect(mockAuth.api.getSession).toHaveBeenCalledWith({
        headers: mockRequest.headers,
      });
      expect(result).toBe(mockSession);
    });

    it('should handle errors from getSession', async () => {
      const mockRequest = { headers: {} };
      const error = new Error('Session error');
      mockAuth.api.getSession.mockRejectedValue(error);

      await expect(service.getSession(mockRequest)).rejects.toThrow(
        'Session error',
      );
    });
  });

  describe('signOut', () => {
    it('should call auth.api.signOut with headers', async () => {
      const mockRequest = {
        headers: {
          cookie: 'session=abc123',
        },
      };
      const mockResult = { success: true };
      mockAuth.api.signOut.mockResolvedValue(mockResult);

      const result = await service.signOut(mockRequest);

      expect(mockAuth.api.signOut).toHaveBeenCalledWith({
        headers: mockRequest.headers,
      });
      expect(result).toBe(mockResult);
    });

    it('should handle errors from signOut', async () => {
      const mockRequest = { headers: {} };
      const error = new Error('Sign out error');
      mockAuth.api.signOut.mockRejectedValue(error);

      await expect(service.signOut(mockRequest)).rejects.toThrow(
        'Sign out error',
      );
    });
  });
});
