import { BetterAuthModuleOptions } from '../better-auth.types';
import { logger } from './logger.util';

/**
 * Rate limiter utility for protecting against brute force attacks
 */
export class RateLimiter {
  private static requests = new Map<
    string,
    { count: number; resetTime: number }
  >();
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize the rate limiter with cleanup interval
   */
  static initialize(): void {
    if (!this.cleanupInterval) {
      // Get cleanup interval from environment variable or default (5 minutes)
      const interval = process.env.RATE_LIMITER_CLEANUP_INTERVAL_MS
        ? parseInt(process.env.RATE_LIMITER_CLEANUP_INTERVAL_MS, 10)
        : 5 * 60 * 1000;

      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, interval);
    }
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @param options - Rate limiting options
   * @returns true if request should be blocked, false otherwise
   */
  static isRateLimited(
    identifier: string,
    options: BetterAuthModuleOptions,
  ): boolean {
    if (!options.enableRateLimit) {
      return false;
    }

    const now = Date.now();
    const windowMs = options.rateLimitWindowMs || 15 * 60 * 1000; // 15 minutes default
    const maxRequests =
      options.rateLimitMax !== undefined ? options.rateLimitMax : 100; // 100 requests default

    // Handle zero or negative limits - should always rate limit
    if (maxRequests <= 0) {
      return true;
    }

    const key = this.sanitizeIdentifier(identifier);
    const requestData = this.requests.get(key);

    if (!requestData || now > requestData.resetTime) {
      // First request or window expired
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    if (requestData.count >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        identifier: key,
        count: requestData.count,
        maxRequests,
        windowMs,
      });
      return true;
    }

    // Increment counter
    requestData.count++;
    this.requests.set(key, requestData);

    return false;
  }

  /**
   * Get rate limit info for an identifier
   * @param identifier - Unique identifier
   * @param options - Rate limiting options
   * @returns Rate limit information
   */
  static getRateLimitInfo(
    identifier: string,
    options: BetterAuthModuleOptions,
  ): {
    remaining: number;
    resetTime: number;
    total: number;
  } {
    if (!options.enableRateLimit) {
      return {
        remaining: Infinity,
        resetTime: 0,
        total: Infinity,
      };
    }

    const maxRequests = options.rateLimitMax || 100;
    const key = this.sanitizeIdentifier(identifier);
    const requestData = this.requests.get(key);

    if (!requestData) {
      return {
        remaining: maxRequests,
        resetTime: 0,
        total: maxRequests,
      };
    }

    return {
      remaining: Math.max(0, maxRequests - requestData.count),
      resetTime: requestData.resetTime,
      total: maxRequests,
    };
  }

  /**
   * Reset rate limit for a specific identifier
   * @param identifier - Unique identifier to reset
   */
  static resetRateLimit(identifier: string): void {
    const key = this.sanitizeIdentifier(identifier);
    this.requests.delete(key);
    logger.info('Rate limit reset', { identifier: key });
  }

  /**
   * Clean up expired entries
   */
  private static cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug('Rate limiter cleanup completed', {
        cleanedEntries: cleanedCount,
        remainingEntries: this.requests.size,
      });
    }
  }

  /**
   * Sanitize identifier to prevent injection attacks
   * @param identifier - Raw identifier
   * @returns Sanitized identifier
   */
  private static sanitizeIdentifier(identifier: string): string {
    if (!identifier || typeof identifier !== 'string') {
      return 'unknown';
    }

    // Remove potentially dangerous characters and limit length
    return identifier.replace(/[^a-zA-Z0-9.:_-]/g, '').substring(0, 100);
  }

  /**
   * Get current statistics
   * @returns Rate limiter statistics
   */
  static getStats(): {
    totalEntries: number;
    activeEntries: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    let activeEntries = 0;
    let expiredEntries = 0;

    for (const [, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        expiredEntries++;
      } else {
        activeEntries++;
      }
    }

    return {
      totalEntries: this.requests.size,
      activeEntries,
      expiredEntries,
    };
  }

  /**
   * Shutdown the rate limiter and clean up resources
   */
  static shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.requests.clear();
    logger.info('Rate limiter shutdown completed');
  }
}

// Initialize rate limiter on module load (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  RateLimiter.initialize();
}
