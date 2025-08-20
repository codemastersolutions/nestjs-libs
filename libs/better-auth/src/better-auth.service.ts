import { Inject, Injectable } from '@nestjs/common';
import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';
import type { Auth, BetterAuthModuleOptions } from './better-auth.types';
import { logger } from './utils/logger.util';
import { RateLimiter } from './utils/rate-limiter.util';
import { RequestValidator } from './utils/request-validator.util';

/**
 * Service that provides Better Auth functionality
 * Handles authentication requests and session management
 */
@Injectable()
export class BetterAuthService {
  /**
   * Creates an instance of BetterAuthService
   * @param auth - The Better Auth instance
   * @param options - The Better Auth module configuration options
   */
  constructor(
    @Inject(BETTER_AUTH_INSTANCE) private readonly auth: Auth,
    @Inject(BETTER_AUTH_OPTIONS)
    private readonly options: BetterAuthModuleOptions,
  ) {}

  /**
   * Gets the Better Auth instance
   * @returns The Better Auth instance with handler and API methods
   */
  getAuth(): Auth {
    return this.auth;
  }

  /**
   * Gets the module configuration options
   * @returns The Better Auth module options
   */
  getOptions(): BetterAuthModuleOptions {
    return this.options;
  }

  /**
   * Handles authentication requests through Better Auth with enhanced security
   * @param request - The Web API Request object
   * @returns Promise that resolves to a Response object
   * @throws Error if request is invalid or missing required properties
   */
  async handleRequest(request: any) {
    // Validate request object before processing
    if (!request || typeof request !== 'object') {
      logger.warn('Invalid request object provided');
      throw new Error('Invalid request object provided');
    }

    // Ensure request has required properties for Web API Request
    if (!('url' in request) && !('method' in request)) {
      logger.warn('Request missing required properties');
      throw new Error('Request must have url and method properties');
    }

    // Enhanced security validation
    const clientIp = this.extractClientIp(request);

    // Check rate limiting
    if (RateLimiter.isRateLimited(clientIp, this.options)) {
      logger.security('Rate limit exceeded', { clientIp });
      throw new Error('Rate limit exceeded');
    }

    logger.debug('Processing authentication request');

    // Better Auth v1.3+ uses different API structure
    // The handler is now accessed differently
    return this.auth.handler(request as Request);
  }

  /**
   * Gets the current session from request headers with enhanced validation
   * @param request - Object containing request headers
   * @returns Promise that resolves to session and user data, or null if no session
   */
  async getSession(request: { headers: Record<string, string | string[]> }) {
    // Validate request headers
    if (!request || !request.headers || typeof request.headers !== 'object') {
      logger.warn('Invalid request headers provided for getSession');
      throw new Error('Invalid request headers provided');
    }

    // Validate headers for security
    const validator = new RequestValidator(this.options);
    const sanitizedHeaders = validator.validateHeaders(request.headers);

    logger.debug('Getting session');

    return this.auth.api.getSession({
      headers: sanitizedHeaders as HeadersInit,
    });
  }

  /**
   * Signs out the current user with enhanced validation
   * @param request - Object containing request headers
   * @returns Promise that resolves to sign out result
   */
  async signOut(request: { headers: Record<string, string | string[]> }) {
    // Validate request headers
    if (!request || !request.headers || typeof request.headers !== 'object') {
      logger.warn('Invalid request headers provided for signOut');
      throw new Error('Invalid request headers provided');
    }

    // Validate headers for security
    const validator = new RequestValidator(this.options);
    const sanitizedHeaders = validator.validateHeaders(request.headers);

    logger.info('User signing out');

    return this.auth.api.signOut({
      headers: sanitizedHeaders as HeadersInit,
    });
  }

  /**
   * Extracts client IP from request for rate limiting
   * @param request - The request object
   * @returns Client IP address
   */
  private extractClientIp(request: any): string {
    // Try various headers for client IP
    const headers = this.extractHeaders(request);
    const xForwardedFor = headers['x-forwarded-for'];
    const xRealIp = headers['x-real-ip'];
    const cfConnectingIp = headers['cf-connecting-ip'];

    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    }
    if (typeof xRealIp === 'string') {
      return xRealIp;
    }
    if (typeof cfConnectingIp === 'string') {
      return cfConnectingIp;
    }

    return 'unknown';
  }

  /**
   * Extracts headers from request object
   * @param request - The request object
   * @returns Headers object
   */
  private extractHeaders(request: any): Record<string, string | string[]> {
    if (
      request &&
      typeof request === 'object' &&
      'headers' in request &&
      (request as { headers: unknown }).headers
    ) {
      return (request as { headers: Record<string, string | string[]> })
        .headers;
    }
    return {};
  }

  /**
   * Extracts body from request object
   * @param request - The request object
   * @returns Request body
   */
  private extractBody(request: any): unknown {
    if (request && typeof request === 'object' && 'body' in request) {
      return (request as { body: unknown }).body;
    }
    return undefined;
  }
}
