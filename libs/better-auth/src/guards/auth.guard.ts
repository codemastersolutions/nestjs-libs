import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { FastifyRequest } from 'fastify';
import { BetterAuthService } from '../better-auth.service';
import { PUBLIC_METADATA_KEY } from '../decorators/public.decorator';

/**
 * Guard that handles authentication for routes
 * Checks if the route is public or if the user is authenticated
 * Automatically injects user and session data into the request object
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Creates an instance of AuthGuard
   * @param betterAuthService - Service to handle authentication operations
   * @param reflector - Optional reflector to read metadata from decorators
   */
  constructor(
    private readonly betterAuthService: BetterAuthService,
    @Optional() private readonly reflector?: Reflector,
  ) {}

  /**
   * Determines if the current request should be allowed to proceed
   * @param context - The execution context containing request information
   * @returns Promise<boolean> - True if access is allowed, throws UnauthorizedException otherwise
   * @throws UnauthorizedException When user is not authenticated or token is invalid
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector?.getAllAndOverride<boolean>(
      PUBLIC_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request | FastifyRequest>();

    try {
      const session = await this.betterAuthService.getSession(request as any);

      if (!session?.user) {
        throw new UnauthorizedException('User not authenticated');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request as any).user = session.user;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request as any).session = session;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
