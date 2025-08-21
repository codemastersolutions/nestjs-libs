import { RateLimiter } from './rate-limiter.util';
import { BetterAuthModuleOptions } from '../better-auth.types';

describe('RateLimiter', () => {
  let originalSetInterval: typeof setInterval;
  let originalClearInterval: typeof clearInterval;
  let mockSetInterval: jest.Mock;
  let mockClearInterval: jest.Mock;
  let intervalCallback: () => void;
  let mockOptions: BetterAuthModuleOptions;

  beforeEach(() => {
    // Mock setInterval and clearInterval
    originalSetInterval = global.setInterval;
    originalClearInterval = global.clearInterval;
    mockSetInterval = jest.fn((callback, delay) => {
      intervalCallback = callback;
      return 'mock-interval-id' as any;
    });
    mockClearInterval = jest.fn();
    global.setInterval = mockSetInterval;
    global.clearInterval = mockClearInterval;

    // Setup mock options
    mockOptions = {
      auth: {} as any,
      enableRateLimit: true,
      rateLimitMax: 10,
      rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    };

    // Clear any existing rate limit data
    (RateLimiter as any).requests.clear();
    (RateLimiter as any).cleanupInterval = null;
  });

  afterEach(() => {
    // Restore original functions
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;
    
    // Clean up
    RateLimiter.shutdown();
    (RateLimiter as any).requests.clear();
  });

  describe('initialize', () => {
    it('should set up cleanup interval', () => {
      RateLimiter.initialize();

      expect(mockSetInterval).toHaveBeenCalledWith(
        expect.any(Function),
        5 * 60 * 1000 // 5 minutes default
      );
      expect((RateLimiter as any).cleanupInterval).toBe('mock-interval-id');
    });

    it('should not create multiple intervals if already initialized', () => {
      RateLimiter.initialize();
      RateLimiter.initialize();

      expect(mockSetInterval).toHaveBeenCalledTimes(1);
    });

    it('should use custom cleanup interval from environment variable', () => {
      const originalEnv = process.env.RATE_LIMITER_CLEANUP_INTERVAL_MS;
      process.env.RATE_LIMITER_CLEANUP_INTERVAL_MS = '30000';
      
      // Reset cleanup interval
      (RateLimiter as any).cleanupInterval = null;
      
      RateLimiter.initialize();

      expect(mockSetInterval).toHaveBeenCalledWith(
        expect.any(Function),
        30000
      );
      
      // Restore environment
      if (originalEnv !== undefined) {
        process.env.RATE_LIMITER_CLEANUP_INTERVAL_MS = originalEnv;
      } else {
        delete process.env.RATE_LIMITER_CLEANUP_INTERVAL_MS;
      }
    });
  });

  describe('isRateLimited', () => {
    beforeEach(() => {
      RateLimiter.initialize();
    });

    it('should return false when rate limiting is disabled', () => {
      const disabledOptions = { ...mockOptions, enableRateLimit: false };
      const result = RateLimiter.isRateLimited('user123', disabledOptions);
      expect(result).toBe(false);
    });

    it('should return false for first request from identifier', () => {
      const result = RateLimiter.isRateLimited('user123', mockOptions);
      expect(result).toBe(false);
    });

    it('should track request count for identifier', () => {
      RateLimiter.isRateLimited('user123', mockOptions);
      const requests = (RateLimiter as any).requests;
      
      expect(requests.has('user123')).toBe(true);
      expect(requests.get('user123').count).toBe(1);
    });

    it('should increment count for subsequent requests', () => {
      RateLimiter.isRateLimited('user123', mockOptions);
      RateLimiter.isRateLimited('user123', mockOptions);
      RateLimiter.isRateLimited('user123', mockOptions);
      
      const requests = (RateLimiter as any).requests;
      expect(requests.get('user123').count).toBe(3);
    });

    it('should return true when rate limit is exceeded', () => {
      // Make requests up to the limit (10)
      for (let i = 0; i < 10; i++) {
        expect(RateLimiter.isRateLimited('user123', mockOptions)).toBe(false);
      }
      
      // 11th request should be rate limited
      expect(RateLimiter.isRateLimited('user123', mockOptions)).toBe(true);
    });

    it('should use custom max requests if provided', () => {
      const customOptions = { ...mockOptions, rateLimitMax: 3 };
      
      // Set custom limit of 3
      for (let i = 0; i < 3; i++) {
        expect(RateLimiter.isRateLimited('user123', customOptions)).toBe(false);
      }
      
      // 4th request should be rate limited
      expect(RateLimiter.isRateLimited('user123', customOptions)).toBe(true);
    });

    it('should use custom window duration if provided', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const customOptions = { ...mockOptions, rateLimitWindowMs: 1000 };
      
      // Make request with custom window of 1000ms
      RateLimiter.isRateLimited('user123', customOptions);
      
      const requests = (RateLimiter as any).requests;
      const entry = requests.get('user123');
      expect(entry.resetTime).toBe(now + 1000);
      
      jest.restoreAllMocks();
    });

    it('should reset count when window expires', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      // Make initial request
      RateLimiter.isRateLimited('user123', mockOptions);
      
      // Simulate time passing beyond window
      jest.spyOn(Date, 'now').mockReturnValue(now + mockOptions.rateLimitWindowMs! + 1);
      
      // Next request should reset the window
      expect(RateLimiter.isRateLimited('user123', mockOptions)).toBe(false);
      
      const requests = (RateLimiter as any).requests;
      const entry = requests.get('user123');
      expect(entry.count).toBe(1);
      
      jest.restoreAllMocks();
    });

    it('should sanitize identifier', () => {
      const maliciousId = '<script>alert("xss")</script>';
      RateLimiter.isRateLimited(maliciousId, mockOptions);
      
      const requests = (RateLimiter as any).requests;
      const sanitizedId = 'scriptalertxssscript';
      expect(requests.has(sanitizedId)).toBe(true);
    });

    it('should handle empty identifier', () => {
      expect(RateLimiter.isRateLimited('', mockOptions)).toBe(false);
      expect(RateLimiter.isRateLimited(null as any, mockOptions)).toBe(false);
      expect(RateLimiter.isRateLimited(undefined as any, mockOptions)).toBe(false);
      
      const requests = (RateLimiter as any).requests;
      expect(requests.has('unknown')).toBe(true);
    });

    it('should use default values when options are not provided', () => {
      const minimalOptions = { ...mockOptions, rateLimitMax: undefined, rateLimitWindowMs: undefined };
      
      // Should use default max of 100
      for (let i = 0; i < 100; i++) {
        expect(RateLimiter.isRateLimited('user123', minimalOptions)).toBe(false);
      }
      
      expect(RateLimiter.isRateLimited('user123', minimalOptions)).toBe(true);
    });
  });

  describe('getRateLimitInfo', () => {
    beforeEach(() => {
      RateLimiter.initialize();
    });

    it('should return infinite limits when rate limiting is disabled', () => {
      const disabledOptions = { ...mockOptions, enableRateLimit: false };
      const info = RateLimiter.getRateLimitInfo('user123', disabledOptions);
      
      expect(info).toEqual({
        remaining: Infinity,
        resetTime: 0,
        total: Infinity,
      });
    });

    it('should return default info for non-existent identifier', () => {
      const info = RateLimiter.getRateLimitInfo('nonexistent', mockOptions);
      
      expect(info).toEqual({
        remaining: 10,
        resetTime: 0,
        total: 10,
      });
    });

    it('should return correct info for existing identifier', () => {
      // Make some requests
      RateLimiter.isRateLimited('user123', mockOptions);
      RateLimiter.isRateLimited('user123', mockOptions);
      RateLimiter.isRateLimited('user123', mockOptions);
      
      const info = RateLimiter.getRateLimitInfo('user123', mockOptions);
      
      expect(info.remaining).toBe(7);
      expect(info.total).toBe(10);
      expect(info.resetTime).toBeGreaterThan(Date.now());
    });

    it('should return correct info when rate limited', () => {
      // Exceed the limit
      for (let i = 0; i < 11; i++) {
        RateLimiter.isRateLimited('user123', mockOptions);
      }
      
      const info = RateLimiter.getRateLimitInfo('user123', mockOptions);
      
      expect(info.remaining).toBe(0);
      expect(info.total).toBe(10);
    });

    it('should use custom max requests in calculation', () => {
      const customOptions = { ...mockOptions, rateLimitMax: 5 };
      
      RateLimiter.isRateLimited('user123', customOptions);
      RateLimiter.isRateLimited('user123', customOptions);
      
      const info = RateLimiter.getRateLimitInfo('user123', customOptions);
      
      expect(info.remaining).toBe(3);
      expect(info.total).toBe(5);
    });

    it('should sanitize identifier', () => {
      const maliciousId = '<script>alert("xss")</script>';
      RateLimiter.isRateLimited(maliciousId, mockOptions);
      
      const info = RateLimiter.getRateLimitInfo(maliciousId, mockOptions);
      expect(info.remaining).toBe(9);
    });
  });

  describe('resetRateLimit', () => {
    beforeEach(() => {
      RateLimiter.initialize();
    });

    it('should remove rate limit entry for identifier', () => {
      // Create rate limit entry
      RateLimiter.isRateLimited('user123', mockOptions);
      
      const requests = (RateLimiter as any).requests;
      expect(requests.has('user123')).toBe(true);
      
      // Reset rate limit
      RateLimiter.resetRateLimit('user123');
      expect(requests.has('user123')).toBe(false);
    });

    it('should handle non-existent identifier gracefully', () => {
      expect(() => RateLimiter.resetRateLimit('nonexistent')).not.toThrow();
    });

    it('should sanitize identifier', () => {
      const maliciousId = '<script>alert("xss")</script>';
      RateLimiter.isRateLimited(maliciousId, mockOptions);
      
      RateLimiter.resetRateLimit(maliciousId);
      
      const requests = (RateLimiter as any).requests;
      const sanitizedId = 'scriptalertxssscript';
      expect(requests.has(sanitizedId)).toBe(false);
    });
  });

  describe('cleanup (private method)', () => {
    beforeEach(() => {
      RateLimiter.initialize();
    });

    it('should remove expired entries', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      // Create entries
      RateLimiter.isRateLimited('user1', mockOptions);
      RateLimiter.isRateLimited('user2', mockOptions);
      
      // Simulate time passing to expire entries
      jest.spyOn(Date, 'now').mockReturnValue(now + mockOptions.rateLimitWindowMs! + 1);
      
      // Trigger cleanup
      intervalCallback();
      
      const requests = (RateLimiter as any).requests;
      expect(requests.has('user1')).toBe(false);
      expect(requests.has('user2')).toBe(false);
      
      jest.restoreAllMocks();
    });

    it('should keep non-expired entries', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      // Create entry
      RateLimiter.isRateLimited('user1', mockOptions);
      
      // Simulate time passing but not enough to expire
      jest.spyOn(Date, 'now').mockReturnValue(now + 60000); // 1 minute
      
      // Trigger cleanup
      intervalCallback();
      
      const requests = (RateLimiter as any).requests;
      expect(requests.has('user1')).toBe(true);
      
      jest.restoreAllMocks();
    });
  });

  describe('sanitizeIdentifier (private method)', () => {
    it('should remove HTML tags and special characters', () => {
      const result = (RateLimiter as any).sanitizeIdentifier('<script>alert("xss")</script>');
      expect(result).toBe('scriptalertxssscript');
    });

    it('should remove special characters', () => {
      const result = (RateLimiter as any).sanitizeIdentifier('user@#$%^&*()123');
      expect(result).toBe('user123');
    });

    it('should handle empty strings and null values', () => {
      expect((RateLimiter as any).sanitizeIdentifier('')).toBe('unknown');
      expect((RateLimiter as any).sanitizeIdentifier(null)).toBe('unknown');
      expect((RateLimiter as any).sanitizeIdentifier(undefined)).toBe('unknown');
    });

    it('should preserve allowed characters', () => {
      const result = (RateLimiter as any).sanitizeIdentifier('user123-test_id.domain:8080');
      expect(result).toBe('user123-test_id.domain:8080');
    });

    it('should limit length to 100 characters', () => {
      const longString = 'a'.repeat(150);
      const result = (RateLimiter as any).sanitizeIdentifier(longString);
      expect(result.length).toBe(100);
    });
  });

  describe('getStats', () => {
    beforeEach(() => {
      RateLimiter.initialize();
    });

    it('should return correct statistics', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      // Create some entries
      RateLimiter.isRateLimited('user1', mockOptions);
      RateLimiter.isRateLimited('user2', mockOptions);
      
      // Create an expired entry
      const requests = (RateLimiter as any).requests;
      requests.set('expired-user', {
        count: 5,
        resetTime: now - 1000 // Expired
      });
      
      const stats = RateLimiter.getStats();
      
      expect(stats.totalEntries).toBe(3);
      expect(stats.activeEntries).toBe(2);
      expect(stats.expiredEntries).toBe(1);
      
      jest.restoreAllMocks();
    });

    it('should return zero stats when no entries exist', () => {
      const stats = RateLimiter.getStats();
      
      expect(stats.totalEntries).toBe(0);
      expect(stats.activeEntries).toBe(0);
      expect(stats.expiredEntries).toBe(0);
    });
  });

  describe('shutdown', () => {
    it('should clear cleanup interval', () => {
      RateLimiter.initialize();
      expect((RateLimiter as any).cleanupInterval).toBe('mock-interval-id');
      
      RateLimiter.shutdown();
      
      expect(mockClearInterval).toHaveBeenCalledWith('mock-interval-id');
      expect((RateLimiter as any).cleanupInterval).toBeNull();
    });

    it('should handle shutdown when not initialized', () => {
      expect(() => RateLimiter.shutdown()).not.toThrow();
      expect(mockClearInterval).not.toHaveBeenCalled();
    });

    it('should clear requests map', () => {
      RateLimiter.initialize();
      RateLimiter.isRateLimited('user1', mockOptions);
      
      const requests = (RateLimiter as any).requests;
      expect(requests.size).toBe(1);
      
      RateLimiter.shutdown();
      expect(requests.size).toBe(0);
    });
  });

  describe('edge cases and error handling', () => {
    beforeEach(() => {
      RateLimiter.initialize();
    });

    it('should handle very large request counts', () => {
      const identifier = 'heavy-user';
      const customOptions = { ...mockOptions, rateLimitMax: 1000 };
      
      // Make a large number of requests
      for (let i = 0; i < 1000; i++) {
        RateLimiter.isRateLimited(identifier, customOptions);
      }
      
      const info = RateLimiter.getRateLimitInfo(identifier, customOptions);
      expect(info.remaining).toBe(0);
      
      // Next request should be rate limited
      expect(RateLimiter.isRateLimited(identifier, customOptions)).toBe(true);
    });

    it('should handle concurrent requests from same identifier', () => {
      const identifier = 'concurrent-user';
      const results: boolean[] = [];
      
      // Simulate concurrent requests
      for (let i = 0; i < 5; i++) {
        results.push(RateLimiter.isRateLimited(identifier, mockOptions));
      }
      
      // All should be allowed (under default limit of 10)
      expect(results.every(result => result === false)).toBe(true);
      
      const info = RateLimiter.getRateLimitInfo(identifier, mockOptions);
      expect(info.remaining).toBe(5);
    });

    it('should handle zero or negative custom limits', () => {
      const zeroOptions = { ...mockOptions, rateLimitMax: 0 };
      const negativeOptions = { ...mockOptions, rateLimitMax: -1 };
      
      expect(RateLimiter.isRateLimited('user1', zeroOptions)).toBe(true);
      expect(RateLimiter.isRateLimited('user2', negativeOptions)).toBe(true);
    });

    it('should handle very short window durations', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const shortWindowOptions = { ...mockOptions, rateLimitWindowMs: 1 };
      
      // Use 1ms window
      RateLimiter.isRateLimited('user1', shortWindowOptions);
      
      // Advance time by 2ms
      jest.spyOn(Date, 'now').mockReturnValue(now + 2);
      
      // Should reset due to expired window
      expect(RateLimiter.isRateLimited('user1', shortWindowOptions)).toBe(false);
      
      const requests = (RateLimiter as any).requests;
      const entry = requests.get('user1');
      expect(entry.count).toBe(1); // Reset count
      
      jest.restoreAllMocks();
    });
  });
});