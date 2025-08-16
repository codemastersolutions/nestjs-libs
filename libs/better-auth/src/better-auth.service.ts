import { Inject, Injectable } from '@nestjs/common';
import type { Auth } from 'better-auth';
import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';
import type { BetterAuthModuleOptions } from './better-auth.types';

@Injectable()
export class BetterAuthService {
  constructor(
    @Inject(BETTER_AUTH_INSTANCE) private readonly auth: Auth,
    @Inject(BETTER_AUTH_OPTIONS)
    private readonly options: BetterAuthModuleOptions,
  ) {}

  /**
   * Get the Better Auth instance
   */
  getAuth(): Auth {
    return this.auth;
  }

  /**
   * Get module options
   */
  getOptions(): BetterAuthModuleOptions {
    return this.options;
  }

  /**
   * Handle authentication request
   */
  async handleRequest(request: any) {
    // Better Auth v1.3+ uses different API structure
    // The handler is now accessed differently
    return this.auth.handler(request as Request);
  }

  /**
   * Get session from request
   */
  async getSession(request: { headers: Record<string, string | string[]> }) {
    return this.auth.api.getSession({
      headers: request.headers as HeadersInit,
    });
  }

  /**
   * Sign out user
   */
  async signOut(request: { headers: Record<string, string | string[]> }) {
    return this.auth.api.signOut({
      headers: request.headers as HeadersInit,
    });
  }
}
