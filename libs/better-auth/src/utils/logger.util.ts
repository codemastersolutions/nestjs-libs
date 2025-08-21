import { LogLevel } from '../better-auth.types';

/**
 * Security-focused logger utility for Better Auth
 * Provides conditional logging based on configured log level
 */
export class BetterAuthLogger {
  private static instance: BetterAuthLogger;
  private logLevel: LogLevel = LogLevel.ERROR;

  private constructor() {}

  /**
   * Gets the singleton logger instance
   */
  static getInstance(): BetterAuthLogger {
    if (!BetterAuthLogger.instance) {
      BetterAuthLogger.instance = new BetterAuthLogger();
    }
    return BetterAuthLogger.instance;
  }

  /**
   * Sets the current log level
   * @param level - The log level to set
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Gets the current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * Checks if a log level should be output
   * @param level - The level to check
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.logLevel === LogLevel.NONE) {
      return false;
    }

    const levels = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
      [LogLevel.NONE]: 4,
    };

    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Logs a debug message (lowest priority)
   * @param message - The message to log
   * @param context - Optional context object (sanitized)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(
        `[BetterAuth:DEBUG] ${message}`,
        this.sanitizeContext(context),
      );
    }
  }

  /**
   * Logs an info message
   * @param message - The message to log
   * @param context - Optional context object (sanitized)
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(
        `[BetterAuth:INFO] ${message}`,
        this.sanitizeContext(context),
      );
    }
  }

  /**
   * Logs a warning message
   * @param message - The message to log
   * @param context - Optional context object (sanitized)
   */
  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(
        `[BetterAuth:WARN] ${message}`,
        this.sanitizeContext(context),
      );
    }
  }

  /**
   * Logs an error message (highest priority)
   * @param message - The message to log
   * @param error - Optional error object
   * @param context - Optional context object (sanitized)
   */
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorInfo = error
        ? { name: error.name, message: error.message }
        : undefined;
      console.error(`[BetterAuth:ERROR] ${message}`, {
        error: errorInfo,
        context: this.sanitizeContext(context),
      });
    }
  }

  /**
   * Sanitizes context object to prevent logging sensitive information
   * @param context - The context to sanitize
   */
  private sanitizeContext(
    context?: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (!context) return undefined;

    const sensitiveKeys = [
      'password',
      'secret',
      'key',
      'token',
      'auth',
      'credential',
      'bearer',
      'x-api-key',
      'apikey',
      'authorization',
      'cookie',
      'session',
    ];

    const visited = new WeakSet();

    // Add the context object itself to prevent self-references
    visited.add(context);

    const sanitizeValue = (value: unknown): unknown => {
      if (value === null || value === undefined) {
        return value;
      }

      if (Array.isArray(value)) {
        if (visited.has(value)) {
          return '[Circular Reference]';
        }
        visited.add(value);
        return value.map((item) => sanitizeValue(item));
      }

      if (typeof value === 'object' && value !== null) {
        if (visited.has(value)) {
          return '[Circular Reference]';
        }
        visited.add(value);

        const sanitizedObj: Record<string, unknown> = {};
        for (const [objKey, objValue] of Object.entries(
          value as Record<string, unknown>,
        )) {
          const lowerKey = objKey.toLowerCase();
          const isSensitive = sensitiveKeys.some((sensitiveKey) =>
            lowerKey.includes(sensitiveKey),
          );

          if (isSensitive) {
            sanitizedObj[objKey] = '[REDACTED]';
          } else {
            sanitizedObj[objKey] = sanitizeValue(objValue);
          }
        }

        return sanitizedObj;
      }

      if (typeof value === 'string' && value.length > 100) {
        // Truncate long strings to prevent log pollution
        return `${value.substring(0, 100)}...[TRUNCATED]`;
      }

      return value;
    };

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(context)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some((sensitiveKey) =>
        lowerKey.includes(sensitiveKey),
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeValue(value);
      }
    }

    return sanitized;
  }

  /**
   * Logs security-related events with high priority
   * Always logs regardless of log level
   * @param event - The security event description
   * @param details - Event details (sanitized)
   */
  security(event: string, details?: Record<string, unknown>): void {
    console.error(`[BetterAuth:SECURITY] ${event}`, {
      timestamp: new Date().toISOString(),
      details: this.sanitizeContext(details),
    });
  }
}

/**
 * Default logger instance for convenience
 */
export const logger = BetterAuthLogger.getInstance();
