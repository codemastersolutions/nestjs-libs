import { ModuleMetadata, Type } from '@nestjs/common';

// Define a more flexible Auth type that matches the actual better-auth structure
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

export interface BetterAuthOptionsFactory {
  createBetterAuthOptions():
    | Promise<BetterAuthModuleOptions>
    | BetterAuthModuleOptions;
}

export interface BetterAuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<BetterAuthOptionsFactory>;
  useClass?: Type<BetterAuthOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<BetterAuthModuleOptions> | BetterAuthModuleOptions;
  inject?: any[];
}
