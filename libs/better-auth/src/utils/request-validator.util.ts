import { BetterAuthModuleOptions } from '../better-auth.types';
import { logger } from './logger.util';

/**
 * Request validation utility for Better Auth
 * Implements security validations for incoming requests
 */
export class RequestValidator {
  private readonly options: BetterAuthModuleOptions;

  constructor(options: BetterAuthModuleOptions) {
    this.options = options;
  }

  /**
   * Validates and sanitizes the host header to prevent Host Header Injection
   * @param hostHeader - The host header value
   * @returns Sanitized host or fallback
   */
  validateHostHeader(hostHeader?: string | string[]): string {
    const rawHost = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

    if (!rawHost) {
      logger.warn('Missing host header, using localhost fallback');
      return 'localhost';
    }

    // Enhanced regex for host validation (including port)
    const hostRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(?::[0-9]{1,5})?$|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(?::[0-9]{1,5})?$/;

    if (!hostRegex.test(rawHost)) {
      logger.security('Host header contains suspicious pattern', {
        host: rawHost,
      });
      return 'localhost';
    }

    // Additional validation for common attack patterns
    const suspiciousPatterns = [
      /[<>"']/,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(rawHost)) {
        logger.security('Host header contains suspicious pattern', {
          pattern: pattern.source,
          host: rawHost,
        });
        return 'localhost';
      }
    }

    return rawHost;
  }

  /**
   * Validates request body size and content type
   * @param body - The request body
   * @param contentType - The content type header
   * @returns Validated body string or undefined
   */
  validateRequestBody(body: any, contentType?: string): string | undefined {
    if (body === null || body === undefined || body === '') return undefined;

    // Validate content type
    const allowedContentTypes = this.options.allowedContentTypes || [
      'application/json',
      'application/x-www-form-urlencoded',
    ];

    if (contentType && !allowedContentTypes.includes(contentType)) {
      logger.security('Invalid content type detected', {
        contentType,
        allowedTypes: allowedContentTypes,
      });
      throw new Error('Invalid content type');
    }

    let bodyString: string;
    try {
      bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    } catch (error) {
      logger.error('Failed to serialize request body', error as Error);
      throw new Error('Invalid request body format');
    }

    // Validate body size
    const maxBodySize = this.options.maxBodySize || 1024 * 1024; // 1MB default
    if (bodyString.length > maxBodySize) {
      logger.security('Request body size exceeds limit', {
        actualSize: bodyString.length,
        maxSize: maxBodySize,
      });
      throw new Error('Request body too large');
    }

    // Check for potentially malicious content
    const maliciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /Function\s*\(/gi,
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(bodyString)) {
        logger.security('Potentially malicious content in request body', {
          pattern: pattern.source,
        });
        // Don't throw here, just log - let the application handle the content
        break;
      }
    }

    return bodyString;
  }

  /**
   * Validates request headers for security issues
   * @param headers - The request headers
   * @returns Sanitized headers
   */
  validateHeaders(
    headers: Record<string, string | string[]>,
  ): Record<string, string | string[]> {
    const sanitizedHeaders: Record<string, string | string[]> = {};
    const maxHeaderSize = 8192; // 8KB max per header
    const maxHeaderCount = 100; // Max number of headers

    const headerEntries = Object.entries(headers);

    if (headerEntries.length > maxHeaderCount) {
      logger.security('Too many headers in request', {
        count: headerEntries.length,
        max: maxHeaderCount,
      });
      throw new Error('Too many headers');
    }

    for (const [key, value] of headerEntries) {
      // Validate header name length and format
      if (key.length > 256 || !/^[a-zA-Z0-9!#$&'*+.^_`|~-]+$/.test(key)) {
        logger.security('Invalid header name detected', { headerName: key });
        continue; // Skip invalid header names
      }

      // Validate header value size
      const valueString = Array.isArray(value) ? value.join(',') : value;
      if (valueString.length > maxHeaderSize) {
        logger.security('Header value too large', {
          headerName: key,
          size: valueString.length,
          maxSize: maxHeaderSize,
        });
        continue; // Skip oversized headers
      }

      // Check for header injection patterns
      if (/[\r\n]/.test(valueString)) {
        logger.security('Header injection attempt detected', {
          headerName: key,
          value: valueString,
        });
        continue; // Skip headers with CRLF injection
      }

      sanitizedHeaders[key.toLowerCase()] = value;
    }

    return sanitizedHeaders;
  }

  /**
   * Validates the request URL for security issues
   * @param url - The request URL
   * @returns Sanitized URL path
   */
  validateUrl(url: string): string {
    if (!url) {
      throw new Error('URL is required');
    }

    // Check for path traversal attempts
    const pathTraversalPatterns = [
      /\.\.\//g,
      /\.\.\\/g,
      /%2e%2e%2f/gi,
      /%2e%2e%5c/gi,
      /\.\.%2f/gi,
      /\.\.%5c/gi,
    ];

    for (const pattern of pathTraversalPatterns) {
      if (pattern.test(url)) {
        logger.security('Path traversal attempt detected', { url });
        throw new Error('Invalid URL path');
      }
    }

    // Check for encoded null bytes and other suspicious characters
    const suspiciousPatterns = [
      /%00/gi, // Null byte
      /%0a/gi, // Line feed
      /%0d/gi, // Carriage return
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        logger.security('Suspicious characters in URL', { url });
        throw new Error('Invalid URL format');
      }
    }

    // Limit URL length to prevent DoS
    const maxUrlLength = 2048;
    if (url.length > maxUrlLength) {
      logger.security('URL too long', {
        length: url.length,
        maxLength: maxUrlLength,
      });
      throw new Error('URL too long');
    }

    return url;
  }

  /**
   * Validates the complete request for security issues
   * @param request - The request object to validate
   * @returns Validation result
   */
  validateRequest(request: {
    url?: string;
    method?: string;
    headers?: Record<string, string | string[]>;
    body?: any;
  }): {
    isValid: boolean;
    sanitizedHeaders?: Record<string, string | string[]>;
    sanitizedBody?: string;
    sanitizedUrl?: string;
    errors: string[];
  } {
    const errors: string[] = [];
    let sanitizedHeaders: Record<string, string | string[]> | undefined;
    let sanitizedBody: string | undefined;
    let sanitizedUrl: string | undefined;

    try {
      // Validate required fields
      if (!request.url) {
        errors.push('URL is required');
      } else {
        sanitizedUrl = this.validateUrl(request.url);
      }

      if (!request.method) {
        errors.push('HTTP method is required');
      }

      // Validate headers if present
      if (request.headers) {
        sanitizedHeaders = this.validateHeaders(request.headers);
      }

      // Validate body if present
      if (request.body) {
        const contentType = request.headers?.['content-type'] as string;
        sanitizedBody = this.validateRequestBody(request.body, contentType);
      }
    } catch (error) {
      errors.push((error as Error).message);
    }

    return {
      isValid: errors.length === 0,
      sanitizedHeaders,
      sanitizedBody,
      sanitizedUrl,
      errors,
    };
  }
}
