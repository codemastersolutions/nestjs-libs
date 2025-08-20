import { RequestValidator } from './request-validator.util';
import { BetterAuthModuleOptions } from '../better-auth.types';
import { logger } from './logger.util';

// Mock the logger
jest.mock('./logger.util', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    security: jest.fn(),
  },
}));

describe('RequestValidator', () => {
  let validator: RequestValidator;
  let mockOptions: BetterAuthModuleOptions;
  let loggerWarnSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;
  let loggerSecuritySpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup mock options
    mockOptions = {
      auth: {} as any,
      allowedContentTypes: ['application/json', 'application/x-www-form-urlencoded'],
      maxBodySize: 1024 * 1024, // 1MB
    };

    validator = new RequestValidator(mockOptions);

    // Setup logger spies
    loggerWarnSpy = logger.warn as jest.Mock;
    loggerErrorSpy = logger.error as jest.Mock;
    loggerSecuritySpy = logger.security as jest.Mock;

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('validateHostHeader', () => {
    it('should return valid host header as-is', () => {
      const validHosts = [
        'example.com',
        'subdomain.example.com',
        'localhost',
        'api.example.com:3000',
        '192.168.1.1:8080',
      ];

      validHosts.forEach(host => {
        expect(validator.validateHostHeader(host)).toBe(host);
      });
    });

    it('should handle array host headers by taking first element', () => {
      const hostArray = ['example.com', 'backup.com'];
      expect(validator.validateHostHeader(hostArray)).toBe('example.com');
    });

    it('should return localhost for missing host header', () => {
      expect(validator.validateHostHeader()).toBe('localhost');
      expect(validator.validateHostHeader(undefined)).toBe('localhost');
      expect(validator.validateHostHeader('')).toBe('localhost');
      expect(loggerWarnSpy).toHaveBeenCalledWith('Missing host header, using localhost fallback');
    });

    it('should sanitize invalid host headers', () => {
      const invalidHosts = [
        'invalid..host',
        'host with spaces',
        'host@invalid',
        'host#invalid',
      ];

      invalidHosts.forEach(host => {
        expect(validator.validateHostHeader(host)).toBe('localhost');
        expect(loggerSecuritySpy).toHaveBeenCalledWith(
          'Host header contains suspicious pattern',
          expect.objectContaining({
            host,
          })
        );
      });
    });

    it('should detect and sanitize suspicious patterns', () => {
      const suspiciousHosts = [
        'example.com<script>',
        'host"with"quotes',
        "host'with'quotes",
        'javascript:alert(1)',
        'data:text/html,<script>',
        'vbscript:msgbox(1)',
      ];

      suspiciousHosts.forEach(host => {
        expect(validator.validateHostHeader(host)).toBe('localhost');
        expect(loggerSecuritySpy).toHaveBeenCalledWith(
          'Host header contains suspicious pattern',
          expect.objectContaining({
            host,
          })
        );
      });
    });

    it('should return localhost for hosts with suspicious patterns - covering lines 51-58', () => {
      // Test specific patterns that trigger the suspicious pattern detection
      const edgeCaseSuspiciousHosts = [
        'host.com\x00null',
        'host.com\r\ninjection',
        'host.com\tinjection',
        'host.com%0ainjection',
        'host.com%0dinjection',
        'host.com%00injection',
      ];

      edgeCaseSuspiciousHosts.forEach(host => {
        const result = validator.validateHostHeader(host);
        // Should return 'localhost' when suspicious pattern is detected (line 52)
        expect(result).toBe('localhost');
        expect(loggerSecuritySpy).toHaveBeenCalledWith(
          'Host header contains suspicious pattern',
          expect.objectContaining({
            host,
          })
        );
      });
    });

    it('should return rawHost for valid hosts - covering lines 55-58', () => {
      // Test valid hosts that should pass through without modification
      const validHosts = [
        'valid-host.com',
        'sub.domain.com',
        'localhost',
        '127.0.0.1',
        'api.example.org',
      ];

      validHosts.forEach(host => {
        const result = validator.validateHostHeader(host);
        // Should return the original rawHost when no suspicious patterns (line 58)
        expect(result).toBe(host);
      });
    });
  });

  describe('validateRequestBody', () => {
    it('should return undefined for empty body', () => {
      expect(validator.validateRequestBody(null)).toBeUndefined();
      expect(validator.validateRequestBody(undefined)).toBeUndefined();
      expect(validator.validateRequestBody('')).toBeUndefined();
    });

    it('should validate allowed content types', () => {
      const validBody = { test: 'data' };
      
      expect(validator.validateRequestBody(validBody, 'application/json')).toBe(
        JSON.stringify(validBody)
      );
      expect(validator.validateRequestBody(validBody, 'application/x-www-form-urlencoded')).toBe(
        JSON.stringify(validBody)
      );
    });

    it('should reject invalid content types', () => {
      const body = { test: 'data' };
      
      expect(() => {
        validator.validateRequestBody(body, 'text/html');
      }).toThrow('Invalid content type');
      
      expect(loggerSecuritySpy).toHaveBeenCalledWith(
        'Invalid content type detected',
        expect.objectContaining({
          contentType: 'text/html',
          allowedTypes: mockOptions.allowedContentTypes,
        })
      );
    });

    it('should handle string bodies', () => {
      const stringBody = 'test=data&other=value';
      expect(validator.validateRequestBody(stringBody)).toBe(stringBody);
    });

    it('should serialize object bodies to JSON', () => {
      const objectBody = { test: 'data', number: 123 };
      expect(validator.validateRequestBody(objectBody)).toBe(JSON.stringify(objectBody));
    });

    it('should handle circular references in body serialization', () => {
      const circularBody: any = { test: 'data' };
      circularBody.self = circularBody;
      
      expect(() => {
        validator.validateRequestBody(circularBody);
      }).toThrow('Invalid request body format');
      
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to serialize request body',
        expect.any(Error)
      );
    });

    it('should reject bodies exceeding size limit', () => {
      const largeBody = 'x'.repeat(mockOptions.maxBodySize! + 1);
      
      expect(() => {
        validator.validateRequestBody(largeBody);
      }).toThrow('Request body too large');
      
      expect(loggerSecuritySpy).toHaveBeenCalledWith(
        'Request body size exceeds limit',
        expect.objectContaining({
          actualSize: largeBody.length,
          maxSize: mockOptions.maxBodySize,
        })
      );
    });

    it('should detect malicious patterns in body content', () => {
      const maliciousBodies = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        'vbscript:msgbox(1)',
        'onclick="alert(1)"',
        'eval("malicious code")',
        'Function("return 1")()',
      ];

      maliciousBodies.forEach(body => {
        // Should not throw, just log
        const result = validator.validateRequestBody(body);
        expect(result).toBe(body);
        expect(loggerSecuritySpy).toHaveBeenCalledWith(
          'Potentially malicious content in request body',
          expect.objectContaining({
            pattern: expect.any(String),
          })
        );
      });
    });

    it('should use default values when options are not provided', () => {
      const validatorWithoutOptions = new RequestValidator({ auth: {} as any });
      const body = { test: 'data' };
      
      // Should use default allowed content types
      expect(validatorWithoutOptions.validateRequestBody(body, 'application/json')).toBe(
        JSON.stringify(body)
      );
      
      // Should use default max body size (1MB)
      const largeBody = 'x'.repeat(1024 * 1024 + 1);
      expect(() => {
        validatorWithoutOptions.validateRequestBody(largeBody);
      }).toThrow('Request body too large');
    });

    it('should handle validateRequestBody with no content type specified', () => {
      const body = { test: 'data', value: 123 };
      
      // Test line 59-62 coverage - validateRequestBody method signature and early return
      const result = validator.validateRequestBody(body);
      expect(result).toBe(JSON.stringify(body));
    });

    it('should handle edge cases in validateRequestBody serialization', () => {
      // Test various data types that need JSON.stringify
      const testCases = [
        { input: { nested: { deep: { value: 'test' } } }, expected: JSON.stringify({ nested: { deep: { value: 'test' } } }) },
        { input: [1, 2, 3, 'test'], expected: JSON.stringify([1, 2, 3, 'test']) },
        { input: { boolean: true, null_val: null, number: 42 }, expected: JSON.stringify({ boolean: true, null_val: null, number: 42 }) }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = validator.validateRequestBody(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('validateHeaders', () => {
    it('should return sanitized headers for valid input', () => {
      const validHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value',
        'User-Agent': 'TestAgent/1.0',
      };

      const result = validator.validateHeaders(validHeaders);
      
      expect(result).toEqual({
        'content-type': 'application/json',
        'authorization': 'Bearer token123',
        'x-custom-header': 'custom-value',
        'user-agent': 'TestAgent/1.0',
      });
    });

    it('should handle array header values', () => {
      const headers = {
        'Accept': ['application/json', 'text/html'],
        'X-Forwarded-For': ['192.168.1.1', '10.0.0.1'],
      };

      const result = validator.validateHeaders(headers);
      
      expect(result).toEqual({
        'accept': ['application/json', 'text/html'],
        'x-forwarded-for': ['192.168.1.1', '10.0.0.1'],
      });
    });

    it('should reject requests with too many headers', () => {
      const tooManyHeaders: Record<string, string> = {};
      for (let i = 0; i < 101; i++) {
        tooManyHeaders[`header-${i}`] = `value-${i}`;
      }

      expect(() => {
        validator.validateHeaders(tooManyHeaders);
      }).toThrow('Too many headers');
      
      expect(loggerSecuritySpy).toHaveBeenCalledWith(
        'Too many headers in request',
        expect.objectContaining({
          count: 101,
          max: 100,
        })
      );
    });

    it('should skip headers with invalid names', () => {
      const headersWithInvalidNames = {
        'Valid-Header': 'valid-value',
        'Invalid Header': 'invalid-name-with-space',
        'Invalid@Header': 'invalid-name-with-at',
        'Invalid[Header]': 'invalid-name-with-brackets',
      };

      const result = validator.validateHeaders(headersWithInvalidNames);
      
      expect(result).toEqual({
        'valid-header': 'valid-value',
      });
      
      expect(loggerSecuritySpy).toHaveBeenCalledTimes(3); // 3 invalid headers
    });

    it('should skip headers with values that are too large', () => {
      const largeValue = 'x'.repeat(8193); // Exceeds 8KB limit
      const headers = {
        'Valid-Header': 'valid-value',
        'Large-Header': largeValue,
      };

      const result = validator.validateHeaders(headers);
      
      expect(result).toEqual({
        'valid-header': 'valid-value',
      });
      
      expect(loggerSecuritySpy).toHaveBeenCalledWith(
        'Header value too large',
        expect.objectContaining({
          headerName: 'Large-Header',
          size: largeValue.length,
          maxSize: 8192,
        })
      );
    });

    it('should detect and skip headers with CRLF injection', () => {
      const headersWithCRLF = {
        'Valid-Header': 'valid-value',
        'Injection-Header': 'value\r\nInjected-Header: injected-value',
        'Another-Injection': 'value\nAnother: injection',
      };

      const result = validator.validateHeaders(headersWithCRLF);
      
      expect(result).toEqual({
        'valid-header': 'valid-value',
      });
      
      expect(loggerSecuritySpy).toHaveBeenCalledWith(
        'Header injection attempt detected',
        expect.objectContaining({
          headerName: 'Injection-Header',
        })
      );
    });

    it('should handle array values when checking for CRLF injection', () => {
      const headers = {
        'Valid-Array': ['value1', 'value2'],
        'Invalid-Array': ['value1\r\ninjection', 'value2'],
      };

      const result = validator.validateHeaders(headers);
      
      expect(result).toEqual({
        'valid-array': ['value1', 'value2'],
      });
    });
  });

  describe('validateUrl', () => {
    it('should return valid URLs as-is', () => {
      const validUrls = [
        '/api/auth/login',
        '/users/123',
        '/api/v1/resources?param=value',
        '/path/to/resource#fragment',
      ];

      validUrls.forEach(url => {
        expect(validator.validateUrl(url)).toBe(url);
      });
    });

    it('should throw error for empty URL', () => {
      expect(() => validator.validateUrl('')).toThrow('URL is required');
      expect(() => validator.validateUrl(null as any)).toThrow('URL is required');
      expect(() => validator.validateUrl(undefined as any)).toThrow('URL is required');
    });

    it('should detect and reject path traversal attempts', () => {
      const pathTraversalUrls = [
        '/api/../../../etc/passwd',
        '/api/..\\..\\windows\\system32',
        '/api/%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '/api/%2e%2e%5c%2e%2e%5cwindows%5csystem32',
        '/api/..%2f..%2fetc%2fpasswd',
        '/api/..%5c..%5cwindows%5csystem32',
      ];

      pathTraversalUrls.forEach(url => {
        expect(() => validator.validateUrl(url)).toThrow('Invalid URL path');
        expect(loggerSecuritySpy).toHaveBeenCalledWith(
          'Path traversal attempt detected',
          { url }
        );
      });
    });

    it('should detect and reject URLs with suspicious characters', () => {
      const suspiciousUrls = [
        '/api/resource%00.txt', // Null byte
        '/api/resource%0a', // Line feed
        '/api/resource%0d', // Carriage return
      ];

      suspiciousUrls.forEach(url => {
        expect(() => validator.validateUrl(url)).toThrow('Invalid URL format');
        expect(loggerSecuritySpy).toHaveBeenCalledWith(
          'Suspicious characters in URL',
          { url }
        );
      });
    });

    it('should reject URLs that are too long', () => {
      const longUrl = '/api/' + 'x'.repeat(2045); // Exceeds 2048 limit
      
      expect(() => validator.validateUrl(longUrl)).toThrow('URL too long');
      
      expect(loggerSecuritySpy).toHaveBeenCalledWith(
        'URL too long',
        expect.objectContaining({
          length: longUrl.length,
          maxLength: 2048,
        })
      );
    });

    it('should allow URLs at the maximum length', () => {
      const maxLengthUrl = '/api/' + 'x'.repeat(2043); // Exactly 2048 characters
      expect(validator.validateUrl(maxLengthUrl)).toBe(maxLengthUrl);
    });
  });

  describe('validateRequest', () => {
    it('should validate a complete valid request', () => {
      const validRequest = {
        url: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
        body: { username: 'test', password: 'password' },
      };

      const result = validator.validateRequest(validRequest);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.sanitizedUrl).toBe('/api/auth/login');
      expect(result.sanitizedHeaders).toEqual({
        'content-type': 'application/json',
        'authorization': 'Bearer token123',
      });
      expect(result.sanitizedBody).toBe(JSON.stringify(validRequest.body));
    });

    it('should return errors for missing required fields', () => {
      const invalidRequest = {};
      
      const result = validator.validateRequest(invalidRequest);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL is required');
      expect(result.errors).toContain('HTTP method is required');
    });

    it('should handle validation errors from individual methods', () => {
      const invalidRequest = {
        url: '/api/../../../etc/passwd', // Path traversal
        method: 'POST',
        headers: {
          'Invalid Header': 'value', // Invalid header name
        },
        body: 'x'.repeat(mockOptions.maxBodySize! + 1), // Body too large
      };

      const result = validator.validateRequest(invalidRequest);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate request without optional fields', () => {
      const minimalRequest = {
        url: '/api/resource',
        method: 'GET',
      };

      const result = validator.validateRequest(minimalRequest);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe('/api/resource');
      expect(result.sanitizedHeaders).toBeUndefined();
      expect(result.sanitizedBody).toBeUndefined();
    });

    it('should handle requests with headers but no body', () => {
      const requestWithHeaders = {
        url: '/api/resource',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer token123',
          'Accept': 'application/json',
        },
      };

      const result = validator.validateRequest(requestWithHeaders);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitizedHeaders).toEqual({
        'authorization': 'Bearer token123',
        'accept': 'application/json',
      });
      expect(result.sanitizedBody).toBeUndefined();
    });

    it('should handle requests with body but no headers', () => {
      const requestWithBody = {
        url: '/api/resource',
        method: 'POST',
        body: { data: 'test' },
      };

      const result = validator.validateRequest(requestWithBody);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitizedBody).toBe(JSON.stringify({ data: 'test' }));
      expect(result.sanitizedHeaders).toBeUndefined();
    });

    it('should use content-type from headers for body validation', () => {
      const requestWithContentType = {
        url: '/api/resource',
        method: 'POST',
        headers: {
          'content-type': 'text/html', // Invalid content type
        },
        body: { data: 'test' },
      };

      const result = validator.validateRequest(requestWithContentType);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid content type');
    });

    it('should collect multiple validation errors', () => {
      const multipleErrorsRequest = {
        url: '', // Empty URL
        method: '', // Empty method (will be falsy)
        headers: {
          'Invalid Header Name': 'value',
        },
        body: 'x'.repeat(mockOptions.maxBodySize! + 1),
      };

      const result = validator.validateRequest(multipleErrorsRequest);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle malformed JSON in body validation', () => {
      // Create an object that will cause JSON.stringify to throw
      const problematicBody = {};
      Object.defineProperty(problematicBody, 'toJSON', {
        value: () => {
          throw new Error('JSON serialization error');
        },
      });

      expect(() => {
        validator.validateRequestBody(problematicBody);
      }).toThrow('Invalid request body format');
    });

    it('should handle very long header names', () => {
      const longHeaderName = 'x'.repeat(1000);
      const headers = {
        [longHeaderName]: 'value',
        'Valid-Header': 'valid-value',
      };

      const result = validator.validateHeaders(headers);
      
      // Should skip the long header name but keep valid ones
      expect(result).toEqual({
        'valid-header': 'valid-value',
      });
    });

    it('should handle empty header values', () => {
      const headers = {
        'Empty-Header': '',
        'Valid-Header': 'valid-value',
      };

      const result = validator.validateHeaders(headers);
      
      expect(result).toEqual({
        'empty-header': '',
        'valid-header': 'valid-value',
      });
    });

    it('should handle numeric header values', () => {
      const headers = {
        'Content-Length': 1234 as any,
        'X-Request-ID': 'abc123',
      };

      const result = validator.validateHeaders(headers);
      
      expect(result).toEqual({
        'content-length': 1234,
        'x-request-id': 'abc123',
      });
    });

    it('should handle boolean and other primitive types in body', () => {
      expect(validator.validateRequestBody(true)).toBe('true');
      expect(validator.validateRequestBody(false)).toBe('false');
      expect(validator.validateRequestBody(123)).toBe('123');
      expect(validator.validateRequestBody(0)).toBe('0');
    });

    it('should handle URL validation with special characters', () => {
      const urlsWithSpecialChars = [
        '/api/resource?param=value&other=123',
        '/api/resource#fragment',
        '/api/resource?query=hello%20world',
        '/api/resource/path-with-dashes_and_underscores',
      ];

      urlsWithSpecialChars.forEach(url => {
        expect(validator.validateUrl(url)).toBe(url);
      });
    });
  });
});