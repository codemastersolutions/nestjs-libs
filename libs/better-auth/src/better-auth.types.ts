import { ModuleMetadata, Type } from '@nestjs/common';

/**
 * Log levels for Better Auth operations
 * Used to control verbosity of logging output
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  NONE = 'none',
}

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
   * Log level for Better Auth operations (default: 'error')
   * Set to 'none' in production to disable all logs
   * @default LogLevel.ERROR
   */
  logLevel?: LogLevel;

  /**
   * Maximum request body size in bytes (default: 1MB)
   * Prevents DoS attacks via large payloads
   * @default 1048576
   */
  maxBodySize?: number;

  /**
   * Request timeout in milliseconds (default: 30s)
   * Prevents slowloris attacks
   * @default 30000
   */
  requestTimeout?: number;

  /**
   * Enable rate limiting (default: true)
   * Prevents brute force attacks
   * @default true
   */
  enableRateLimit?: boolean;

  /**
   * Rate limit window in milliseconds (default: 15 minutes)
   * @default 900000
   */
  rateLimitWindowMs?: number;

  /**
   * Maximum requests per window (default: 100)
   * @default 100
   */
  rateLimitMax?: number;

  /**
   * Allowed content types for requests
   * @default ['application/json', 'application/x-www-form-urlencoded']
   */
  allowedContentTypes?: string[];

  /**
   * Disable the middleware (default: false)
   *
   * ⚠️ CRITICAL SECURITY WARNING: Disabling middleware removes authentication protection.
   * Only disable if you have implemented alternative authentication mechanisms.
   * This setting should NEVER be true in production.
   * @default false
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
