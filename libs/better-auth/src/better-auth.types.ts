import { ModuleMetadata, Type } from '@nestjs/common';

/**
 * Better Auth instance interface that matches the actual better-auth structure
 * Provides authentication handling and API methods
 */
export interface Auth {
  handler: (request: Request) => Promise<Response>;
  api: {
    getSession: (context: {
      headers: HeadersInit;
      query?: {
        disableCookieCache?: boolean;
        disableRefresh?: boolean;
      };
      asResponse?: boolean;
    }) => Promise<{
      session: Record<string, unknown> | null;
      user: Record<string, unknown> | null;
    } | null>;
    signOut: (context: { headers: HeadersInit }) => Promise<{
      success: boolean;
    }>;
    [key: string]: unknown;
  };
  options: Record<string, unknown>;
  $ERROR_CODES: Record<string, unknown>;
  $context: Promise<Record<string, unknown>>;
}

export interface BetterAuthModuleOptions {
  /**
   * Better Auth configuration options
   */
  auth: Auth;

  /**
   * Disable the exception filter (default: false)
   *
   * ⚠️ SECURITY WARNING: Disabling exception filter may expose sensitive error information.
   * Consider the security implications before disabling.
   */
  disableExceptionFilter?: boolean;

  /**
   * Disable trusted origins CORS (default: false)
   *
   * ⚠️ SECURITY WARNING: Disabling CORS protection can expose your application to
   * cross-origin attacks. Only disable if you have alternative CORS protection
   * or understand the security implications.
   */
  disableTrustedOriginsCors?: boolean;

  /**
   * Disable body parser (default: false)
   */
  disableBodyParser?: boolean;

  /**
   * Global prefix for routes
   */
  globalPrefix?: string;

  /**
   * Disable the middleware (default: false)
   *
   * ⚠️ SECURITY WARNING: Disabling middleware removes authentication protection.
   * Only disable if you have alternative authentication mechanisms in place.
   */
  disableMiddleware?: boolean;
}

/**
 * Factory interface for creating Better Auth options
 * Used for dynamic configuration in async module setup
 */
export interface BetterAuthOptionsFactory {
  /**
   * Creates Better Auth configuration options
   * @returns Promise or synchronous Better Auth module options
   */
  createBetterAuthOptions():
    | Promise<BetterAuthModuleOptions>
    | BetterAuthModuleOptions;
}

/**
 * Async configuration options for Better Auth module
 * Supports various patterns for dynamic module configuration
 */
export interface BetterAuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** Use an existing provider that implements BetterAuthOptionsFactory */
  useExisting?: Type<BetterAuthOptionsFactory>;
  /** Use a class that implements BetterAuthOptionsFactory */
  useClass?: Type<BetterAuthOptionsFactory>;
  /** Use a factory function to create options */
  useFactory?: (
    ...args: any[]
  ) => Promise<BetterAuthModuleOptions> | BetterAuthModuleOptions;
  /** Dependencies to inject into the factory function */
  inject?: any[];
}
