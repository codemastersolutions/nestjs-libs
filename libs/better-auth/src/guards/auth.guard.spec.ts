import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { BetterAuthService } from '../better-auth.service';
import { PUBLIC_METADATA_KEY } from '../decorators/public.decorator';
import { RateLimiter } from '../utils/rate-limiter.util';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let betterAuthService: jest.Mocked<BetterAuthService>;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const mockBetterAuthService = {
      getSession: jest.fn(),
    };

    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: BetterAuthService,
          useValue: mockBetterAuthService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    betterAuthService = module.get(BetterAuthService);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access to public routes', async () => {
    const mockContext = createMockExecutionContext();
    reflector.getAllAndOverride.mockReturnValue(true);

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      PUBLIC_METADATA_KEY,
      [mockContext.getHandler(), mockContext.getClass()],
    );
  });

  it('should allow access when user is authenticated', async () => {
    const mockContext = createMockExecutionContext();
    const mockSession = { 
      session: { id: 'session-1' },
      user: { id: '1', email: 'test@example.com' } 
    };

    reflector.getAllAndOverride.mockReturnValue(false);
    betterAuthService.getSession.mockResolvedValue(mockSession);

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(betterAuthService.getSession).toHaveBeenCalled();
  });

  it('should deny access when user is not authenticated', async () => {
    const mockContext = createMockExecutionContext();

    reflector.getAllAndOverride.mockReturnValue(false);
    betterAuthService.getSession.mockResolvedValue(null);

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should deny access when session has no user', async () => {
    const mockContext = createMockExecutionContext();
    const mockSession = { 
      session: { id: 'session-1' },
      user: null 
    };

    reflector.getAllAndOverride.mockReturnValue(false);
    betterAuthService.getSession.mockResolvedValue(mockSession);

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should handle service errors', async () => {
    const mockContext = createMockExecutionContext();

    reflector.getAllAndOverride.mockReturnValue(false);
    betterAuthService.getSession.mockRejectedValue(new Error('Service error'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  function createMockExecutionContext(): ExecutionContext {
    const mockRequest = {
      headers: {},
      user: undefined,
      session: undefined,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as unknown as ExecutionContext;
  }
});