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
import { RateLimiter } from './utils/rate-limiter.util';
import { RequestValidator } from './utils/request-validator.util';

describe('BetterAuthService', () => {
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
      const mockResponse = new Response('{}', { status: 200 });
      mockAuth.handler.mockResolvedValue(mockResponse);

      const result = await service.handleRequest(mockRequest);

      expect(mockAuth.handler).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });

    it('should handle auth requests properly', async () => {
      const mockRequest = new Request('http://localhost:3000/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const mockResponse = new Response('{}', { status: 200 });
      mockAuth.handler.mockResolvedValue(mockResponse);

      const result = await service.handleRequest(mockRequest);
      expect(mockAuth.handler).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });

    it('should throw error for invalid request object', async () => {
      await expect(service.handleRequest(null)).rejects.toThrow(
        'Invalid request object provided',
      );

      await expect(service.handleRequest('invalid')).rejects.toThrow(
        'Invalid request object provided',
      );

      await expect(service.handleRequest(123)).rejects.toThrow(
        'Invalid request object provided',
      );
    });

    it('should throw error for request without url and method', async () => {
      const invalidRequest = {};

      await expect(service.handleRequest(invalidRequest)).rejects.toThrow(
        'Request must have url and method properties',
      );
    });
  });

  describe('getSession', () => {
    it('should call auth.api.getSession with headers', async () => {
      const mockRequest = {
        headers: {
          'cookie': 'better-auth.session_token=test-token',
          'user-agent': 'test-agent',
        },
      };
      const mockSession = { session: { id: '1' }, user: { id: '1', email: 'test@example.com' } };
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
          'cookie': ['better-auth.session_token=test-token'],
          'user-agent': 'test-agent',
        },
      };
      const mockSession = { session: null, user: null };
      mockAuth.api.getSession.mockResolvedValue(mockSession);

      const result = await service.getSession(mockRequest);

      expect(mockAuth.api.getSession).toHaveBeenCalledWith({
        headers: mockRequest.headers,
      });
      expect(result).toBe(mockSession);
    });

    it('should handle requests without session', async () => {
      const mockRequest = { headers: {} };
      const mockSession = { session: null, user: null };
      mockAuth.api.getSession.mockResolvedValue(mockSession);

      const result = await service.getSession(mockRequest);

      expect(mockAuth.api.getSession).toHaveBeenCalledWith({
        headers: mockRequest.headers,
      });
      expect(result).toBe(mockSession);
    });

    it('should throw error for invalid request headers', async () => {
      await expect(service.getSession(null as any)).rejects.toThrow(
        'Invalid request headers provided',
      );

      await expect(service.getSession({} as any)).rejects.toThrow(
        'Invalid request headers provided',
      );

      await expect(
        service.getSession({ headers: null } as any),
      ).rejects.toThrow('Invalid request headers provided');

      await expect(
        service.getSession({ headers: 'invalid' } as any),
      ).rejects.toThrow('Invalid request headers provided');
    });

    it('should handle headers as number in getSession', async () => {
      const mockRequest = {
        headers: 123 as any,
      };

      await expect(service.getSession(mockRequest)).rejects.toThrow(
        'Invalid request headers provided',
      );
    });

    it('should handle headers as boolean in getSession', async () => {
      const mockRequest = {
        headers: true as any,
      };

      await expect(service.getSession(mockRequest)).rejects.toThrow(
        'Invalid request headers provided',
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

    it('should throw error for invalid request headers in signOut', async () => {
      await expect(service.signOut(null as any)).rejects.toThrow(
        'Invalid request headers provided',
      );

      await expect(service.signOut({} as any)).rejects.toThrow(
        'Invalid request headers provided',
      );

      await expect(service.signOut({ headers: null } as any)).rejects.toThrow(
        'Invalid request headers provided',
      );

      await expect(
        service.signOut({ headers: 'invalid' } as any),
      ).rejects.toThrow('Invalid request headers provided');

      await expect(
        service.signOut({ headers: undefined } as any),
      ).rejects.toThrow('Invalid request headers provided');
    });

    it('should throw error for invalid request in signOut (undefined request)', async () => {
      await expect(service.signOut(undefined as any)).rejects.toThrow(
        'Invalid request headers provided',
      );
    });

    it('should handle headers as number in signOut', async () => {
      const mockRequest = {
        headers: 123 as any,
      };

      await expect(service.signOut(mockRequest)).rejects.toThrow(
        'Invalid request headers provided',
      );
    });

    it('should handle headers as boolean in signOut', async () => {
      const mockRequest = {
        headers: true as any,
      };

      await expect(service.signOut(mockRequest)).rejects.toThrow(
        'Invalid request headers provided',
      );
    });
  });

  describe('Private methods (via public interface)', () => {
    describe('extractClientIp', () => {
      it('should extract IP from x-forwarded-for header', async () => {
        const mockRequest = {
          url: 'http://localhost:3000/api/auth/session',
          method: 'GET',
          headers: {
            'x-forwarded-for': '192.168.1.1, 10.0.0.1',
          },
        };
        
        // Mock RateLimiter to avoid rate limiting
        jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
        
        await service.handleRequest(mockRequest);
        
        expect(RateLimiter.isRateLimited).toHaveBeenCalledWith('192.168.1.1', mockOptions);
      });

      it('should extract IP from x-real-ip header when x-forwarded-for is not available', async () => {
        const mockRequest = {
          url: 'http://localhost:3000/api/auth/session',
          method: 'GET',
          headers: {
            'x-real-ip': '203.0.113.1',
          },
        };
        
        jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
        
        await service.handleRequest(mockRequest);
        
        expect(RateLimiter.isRateLimited).toHaveBeenCalledWith('203.0.113.1', mockOptions);
      });

      it('should extract IP from cf-connecting-ip header when others are not available', async () => {
        const mockRequest = {
          url: 'http://localhost:3000/api/auth/session',
          method: 'GET',
          headers: {
            'cf-connecting-ip': '198.51.100.1',
          },
        };
        
        jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
        
        await service.handleRequest(mockRequest);
        
        expect(RateLimiter.isRateLimited).toHaveBeenCalledWith('198.51.100.1', mockOptions);
      });

      it('should return "unknown" when no IP headers are present', async () => {
        const mockRequest = {
          url: 'http://localhost:3000/api/auth/session',
          method: 'GET',
          headers: {},
        };
        
        jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
        
        await service.handleRequest(mockRequest);
        
        expect(RateLimiter.isRateLimited).toHaveBeenCalledWith('unknown', mockOptions);
      });

      it('should handle array values in x-forwarded-for header', async () => {
        const mockRequest = {
          url: 'http://localhost:3000/api/auth/session',
          method: 'GET',
          headers: {
            'x-forwarded-for': ['192.168.1.1, 10.0.0.1'],
          },
        };
        
        jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
        
        await service.handleRequest(mockRequest);
        
        expect(RateLimiter.isRateLimited).toHaveBeenCalledWith('unknown', mockOptions);
      });
    });

    describe('extractHeaders', () => {
      it('should extract headers from request object', async () => {
        const mockRequest = {
          headers: {
            'authorization': 'Bearer token123',
            'content-type': 'application/json',
          },
        };
        
        const result = await service.getSession(mockRequest);
        
        expect(mockAuth.api.getSession).toHaveBeenCalledWith({
          headers: mockRequest.headers,
        });
      });

      it('should return empty object when headers are not present', async () => {
        const mockRequest = {};
        
        await expect(service.getSession(mockRequest as any)).rejects.toThrow(
          'Invalid request headers provided',
        );
      });

      it('should handle request without headers property', async () => {
        const mockRequest = {
          someOtherProperty: 'value',
        };
        
        await expect(service.getSession(mockRequest as any)).rejects.toThrow(
          'Invalid request headers provided',
        );
      });
    });

    describe('extractBody', () => {
      it('should handle rate limiting with body extraction', async () => {
        const mockRequest = {
          url: 'http://localhost:3000/api/auth/session',
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: { username: 'test', password: 'password' },
        };
        
        jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
        
        await service.handleRequest(mockRequest);
        
        expect(mockAuth.handler).toHaveBeenCalledWith(mockRequest);
      });

      it('should handle request without body property', async () => {
        const mockRequest = {
          url: 'http://localhost:3000/api/auth/session',
          method: 'GET',
          headers: {},
        };
        
        jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
        
        await service.handleRequest(mockRequest);
        
        expect(mockAuth.handler).toHaveBeenCalledWith(mockRequest);
      });
    });
  });

  describe('Rate limiting integration', () => {
    it('should throw error when rate limit is exceeded', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/auth/session',
        method: 'GET',
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      };
      
      jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(true);
      
      await expect(service.handleRequest(mockRequest)).rejects.toThrow(
        'Rate limit exceeded',
      );
    });

    it('should proceed when rate limit is not exceeded', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/auth/session',
        method: 'GET',
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      };
      
      jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
      
      const result = await service.handleRequest(mockRequest);
      
      expect(result).toBeDefined();
      expect(mockAuth.handler).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('Request validation integration', () => {
    beforeEach(() => {
      jest.spyOn(RateLimiter, 'isRateLimited').mockReturnValue(false);
    });





    it('should validate headers using RequestValidator in getSession', async () => {
       const validateHeadersSpy = jest.spyOn(RequestValidator.prototype, 'validateHeaders');
       validateHeadersSpy.mockReturnValue({
         host: 'localhost:3000',
         'user-agent': 'test-agent',
       });
       
       
       
       const mockRequest = {
         headers: {
           host: 'localhost:3000',
           'user-agent': 'test-agent',
         },
       };
       
       await service.getSession(mockRequest);
       
       expect(validateHeadersSpy).toHaveBeenCalledWith({
         host: 'localhost:3000',
         'user-agent': 'test-agent',
       });
     });

    it('should validate headers using RequestValidator in signOut', async () => {
      const validateHeadersSpy = jest.spyOn(RequestValidator.prototype, 'validateHeaders');
      validateHeadersSpy.mockReturnValue({
        host: 'localhost:3000',
        cookie: 'session=abc123',
      });
    const mockRequest = {
        headers: {
          host: 'localhost:3000',
          cookie: 'session=abc123',
        },
      };
      
      await service.signOut(mockRequest);
      
      expect(validateHeadersSpy).toHaveBeenCalledWith({
        host: 'localhost:3000',
        cookie: 'session=abc123',
      });
    });

    it('should reject malicious headers in getSession', async () => {
      const validateHeadersSpy = jest.spyOn(RequestValidator.prototype, 'validateHeaders');
      validateHeadersSpy.mockImplementation(() => {
        throw new Error('CRLF injection detected in headers');
      });
      
      const mockRequest = {
        headers: {
          'x-custom-header': 'value\r\nSet-Cookie: malicious=true',
        },
      };
      
      await expect(service.getSession(mockRequest)).rejects.toThrow(
        'CRLF injection detected in headers'
      );
    });

    it('should reject malicious headers in signOut', async () => {
      const validateHeadersSpy = jest.spyOn(RequestValidator.prototype, 'validateHeaders');
      validateHeadersSpy.mockImplementation(() => {
        throw new Error('CRLF injection detected in headers');
      });
      
      const mockRequest = {
        headers: {
          'x-custom-header': 'value\r\nSet-Cookie: malicious=true',
        },
      };
      
      await expect(service.signOut(mockRequest)).rejects.toThrow(
        'CRLF injection detected in headers'
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
