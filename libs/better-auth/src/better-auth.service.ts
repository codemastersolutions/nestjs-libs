import { Inject, Injectable } from '@nestjs/common';
import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';
import type { Auth, BetterAuthModuleOptions } from './better-auth.types';

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
   * Handles authentication requests through Better Auth
   * @param request - The Web API Request object
   * @returns Promise that resolves to a Response object
   * @throws Error if request is invalid or missing required properties
   */
  async handleRequest(request: any) {
    // Validate request object before processing
    if (!request || typeof request !== 'object') {
      throw new Error('Invalid request object provided');
    }

    // Ensure request has required properties for Web API Request
    if (!('url' in request) && !('method' in request)) {
      throw new Error('Request must have url and method properties');
    }

    // Better Auth v1.3+ uses different API structure
    // The handler is now accessed differently
    return this.auth.handler(request as Request);
  }

  /**
   * Gets the current session from request headers
   * @param request - Object containing request headers
   * @returns Promise that resolves to session and user data, or null if no session
   */
  async getSession(request: { headers: Record<string, string | string[]> }) {
    // Validate request headers
    if (!request || !request.headers || typeof request.headers !== 'object') {
      throw new Error('Invalid request headers provided');
    }

    return this.auth.api.getSession({
      headers: request.headers as HeadersInit,
    });
  }

  /**
   * Signs out the current user
   * @param request - Object containing request headers
   * @returns Promise that resolves to sign out result
   */
  async signOut(request: { headers: Record<string, string | string[]> }) {
    // Validate request headers
    if (!request || !request.headers || typeof request.headers !== 'object') {
      throw new Error('Invalid request headers provided');
    }

    return this.auth.api.signOut({
      headers: request.headers as HeadersInit,
    });
  }
}
