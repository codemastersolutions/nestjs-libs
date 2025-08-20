import { LogLevel } from '../better-auth.types';
import { BetterAuthLogger, logger } from './logger.util';

describe('BetterAuthLogger', () => {
  let loggerInstance: BetterAuthLogger;
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerInstance = BetterAuthLogger.getInstance();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    // Reset logger level to default
    loggerInstance.setLogLevel(LogLevel.ERROR);
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = BetterAuthLogger.getInstance();
      const instance2 = BetterAuthLogger.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should export a default logger instance', () => {
      expect(logger).toBeInstanceOf(BetterAuthLogger);
    });
  });

  describe('setLogLevel and getLogLevel', () => {
    it('should set and get log level', () => {
      loggerInstance.setLogLevel(LogLevel.DEBUG);
      expect(loggerInstance.getLogLevel()).toBe(LogLevel.DEBUG);

      loggerInstance.setLogLevel(LogLevel.WARN);
      expect(loggerInstance.getLogLevel()).toBe(LogLevel.WARN);

      loggerInstance.setLogLevel(LogLevel.ERROR);
      expect(loggerInstance.getLogLevel()).toBe(LogLevel.ERROR);

      loggerInstance.setLogLevel(LogLevel.NONE);
      expect(loggerInstance.getLogLevel()).toBe(LogLevel.NONE);
    });

    it('should default to error level', () => {
      const freshInstance = BetterAuthLogger.getInstance();
      expect(freshInstance.getLogLevel()).toBe(LogLevel.ERROR);
    });
  });

  describe('shouldLog (private method behavior)', () => {
    it('should log debug messages when level is debug', () => {
      loggerInstance.setLogLevel(LogLevel.DEBUG);
      loggerInstance.debug('Test debug');
      loggerInstance.info('Test info');
      loggerInstance.warn('Test warn');
      loggerInstance.error('Test error');

      expect(consoleDebugSpy).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log info and above when level is info', () => {
      loggerInstance.setLogLevel(LogLevel.INFO);
      loggerInstance.debug('Test debug');
      loggerInstance.info('Test info');
      loggerInstance.warn('Test warn');
      loggerInstance.error('Test error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log warn and above when level is warn', () => {
      loggerInstance.setLogLevel(LogLevel.WARN);
      loggerInstance.debug('Test debug');
      loggerInstance.info('Test info');
      loggerInstance.warn('Test warn');
      loggerInstance.error('Test error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log only error when level is error', () => {
      loggerInstance.setLogLevel(LogLevel.ERROR);
      loggerInstance.debug('Test debug');
      loggerInstance.info('Test info');
      loggerInstance.warn('Test warn');
      loggerInstance.error('Test error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should not log anything when level is none', () => {
      loggerInstance.setLogLevel(LogLevel.NONE);
      loggerInstance.debug('Test debug');
      loggerInstance.info('Test info');
      loggerInstance.warn('Test warn');
      loggerInstance.error('Test error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('sanitizeContext', () => {
    it('should sanitize sensitive information from context', () => {
      const sensitiveContext = {
        password: 'secret123',
        token: 'jwt-token',
        secret: 'api-secret',
        key: 'encryption-key',
        authorization: 'Bearer token',
        cookie: 'session=abc123',
        normalField: 'safe-value',
      };

      // Access private method through any casting
      const sanitized = (loggerInstance as any).sanitizeContext(
        sensitiveContext,
      );

      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.secret).toBe('[REDACTED]');
      expect(sanitized.key).toBe('[REDACTED]');
      expect(sanitized.authorization).toBe('[REDACTED]');
      expect(sanitized.cookie).toBe('[REDACTED]');
      expect(sanitized.normalField).toBe('safe-value');
    });

    it('should handle nested objects', () => {
      const nestedContext = {
        user: {
          id: '123',
          password: 'secret',
          profile: {
            name: 'John',
            token: 'user-token',
          },
        },
        config: {
          apiKey: 'api-key-123',
          publicUrl: 'https://example.com',
        },
      };

      const sanitized = (loggerInstance as any).sanitizeContext(nestedContext);

      expect(sanitized.user.id).toBe('123');
      expect(sanitized.user.password).toBe('[REDACTED]');
      expect(sanitized.user.profile.name).toBe('John');
      expect(sanitized.user.profile.token).toBe('[REDACTED]');
      expect(sanitized.config.apiKey).toBe('[REDACTED]');
      expect(sanitized.config.publicUrl).toBe('https://example.com');
    });

    it('should handle arrays', () => {
      const contextWithArray = {
        users: [
          { id: '1', password: 'secret1' },
          { id: '2', token: 'token2' },
        ],
        tags: ['public', 'private'],
      };

      const sanitized = (loggerInstance as any).sanitizeContext(
        contextWithArray,
      );

      expect(sanitized.users[0].id).toBe('1');
      expect(sanitized.users[0].password).toBe('[REDACTED]');
      expect(sanitized.users[1].id).toBe('2');
      expect(sanitized.users[1].token).toBe('[REDACTED]');
      expect(sanitized.tags).toEqual(['public', 'private']);
    });

    it('should handle null and undefined values', () => {
      const contextWithNulls = {
        nullValue: null,
        undefinedValue: undefined,
        password: 'secret',
      };

      const sanitized = (loggerInstance as any).sanitizeContext(
        contextWithNulls,
      );

      expect(sanitized.nullValue).toBeNull();
      expect(sanitized.undefinedValue).toBeUndefined();
      expect(sanitized.password).toBe('[REDACTED]');
    });

    it('should handle circular references', () => {
      const circularContext: any = {
        name: 'test',
        password: 'secret',
      };
      circularContext.self = circularContext;

      const sanitized = (loggerInstance as any).sanitizeContext(
        circularContext,
      );

      expect(sanitized).toBeDefined();
      expect(sanitized.name).toBe('test');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.self).toBe('[Circular Reference]');
    });

    it('should handle nested circular references', () => {
      const obj1: any = { name: 'obj1' };
      const obj2: any = { name: 'obj2', ref: obj1 };
      obj1.ref = obj2;

      const sanitized = (loggerInstance as any).sanitizeContext({
        data: obj1,
      });

      expect(sanitized.data.name).toBe('obj1');
      expect(sanitized.data.ref.name).toBe('obj2');
      expect(sanitized.data.ref.ref).toBe('[Circular Reference]');
    });

    it('should redact sensitive keys in nested objects', () => {
      const contextWithNestedSensitive = {
        user: {
          id: '123',
          name: 'John',
          password: 'secret123',
          profile: {
            email: 'john@example.com',
            apiKey: 'sensitive-key',
            preferences: {
              theme: 'dark',
              token: 'user-token'
            }
          }
        },
        config: {
          database: {
            host: 'localhost',
            secret: 'db-secret'
          }
        }
      };

      const sanitized = (loggerInstance as any).sanitizeContext(
        contextWithNestedSensitive,
      );

      // Test line 169 - nested object sanitization
      expect(sanitized.user.id).toBe('123');
      expect(sanitized.user.name).toBe('John');
      expect(sanitized.user.password).toBe('[REDACTED]');
      expect(sanitized.user.profile.email).toBe('john@example.com');
      expect(sanitized.user.profile.apiKey).toBe('[REDACTED]');
      expect(sanitized.user.profile.preferences.theme).toBe('dark');
      expect(sanitized.user.profile.preferences.token).toBe('[REDACTED]');
      
      // Test lines 204-211 - top-level object sanitization
      expect(sanitized.config.database.host).toBe('localhost');
      expect(sanitized.config.database.secret).toBe('[REDACTED]');
    });

    it('should handle mixed sensitive and non-sensitive keys at root level', () => {
      const mixedContext = {
        publicData: 'visible',
        password: 'secret',
        userId: '12345',
        authorization: 'Bearer token',
        metadata: {
          version: '1.0',
          key: 'sensitive-key'
        }
      };

      const sanitized = (loggerInstance as any).sanitizeContext(mixedContext);

      // Test lines 204-211 coverage
      expect(sanitized.publicData).toBe('visible');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.userId).toBe('12345');
      expect(sanitized.authorization).toBe('[REDACTED]');
      expect(sanitized.metadata.version).toBe('1.0');
      expect(sanitized.metadata.key).toBe('[REDACTED]');
    });
  });

  describe('debug', () => {
    it('should log debug messages when level is debug', () => {
      loggerInstance.setLogLevel(LogLevel.DEBUG);
      loggerInstance.debug('Debug message', { key: 'value' });

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:DEBUG]'),
        expect.objectContaining({ key: '[REDACTED]' }),
      );
    });

    it('should not log debug messages when level is info', () => {
      loggerInstance.setLogLevel(LogLevel.INFO);
      loggerInstance.debug('Debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should sanitize context in debug messages', () => {
      loggerInstance.setLogLevel(LogLevel.DEBUG);
      loggerInstance.debug('Debug with sensitive data', { password: 'secret' });

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:DEBUG]'),
        expect.objectContaining({ password: '[REDACTED]' }),
      );
    });
  });

  describe('info', () => {
    it('should log info messages when level is info or lower', () => {
      loggerInstance.setLogLevel(LogLevel.INFO);
      loggerInstance.info('Info message', { key: 'value' });

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:INFO]'),
        expect.objectContaining({ key: '[REDACTED]' }),
      );
    });

    it('should not log info messages when level is warn', () => {
      loggerInstance.setLogLevel(LogLevel.WARN);
      loggerInstance.info('Info message');

      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('should sanitize context in info messages', () => {
      loggerInstance.setLogLevel(LogLevel.INFO);
      loggerInstance.info('Info with token', { token: 'jwt-token' });

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:INFO]'),
        expect.objectContaining({ token: '[REDACTED]' }),
      );
    });
  });

  describe('warn', () => {
    it('should log warn messages when level is warn or lower', () => {
      loggerInstance.setLogLevel(LogLevel.WARN);
      loggerInstance.warn('Warning message', { key: 'value' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:WARN]'),
        expect.objectContaining({ key: '[REDACTED]' }),
      );
    });

    it('should not log warn messages when level is error', () => {
      loggerInstance.setLogLevel(LogLevel.ERROR);
      loggerInstance.warn('Warning message');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should sanitize context in warn messages', () => {
      loggerInstance.setLogLevel(LogLevel.WARN);
      loggerInstance.warn('Warning with secret', { secret: 'api-secret' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:WARN]'),
        expect.objectContaining({ secret: '[REDACTED]' }),
      );
    });
  });

  describe('error', () => {
    it('should log error messages when level is error or lower', () => {
      loggerInstance.setLogLevel(LogLevel.ERROR);
      const testError = new Error('Test error');
      loggerInstance.error('Error message', testError, {
        key: 'value',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:ERROR]'),
        expect.objectContaining({
          error: expect.objectContaining({
            name: testError.name,
            message: testError.message,
          }),
          context: expect.objectContaining({ key: '[REDACTED]' }),
        }),
      );
    });

    it('should not log error messages when level is none', () => {
      loggerInstance.setLogLevel(LogLevel.NONE);
      loggerInstance.error('Error message');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should sanitize context in error messages', () => {
      loggerInstance.setLogLevel(LogLevel.ERROR);
      loggerInstance.error('Error with key', undefined, {
        key: 'encryption-key',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:ERROR]'),
        expect.objectContaining({
          error: undefined,
          context: expect.objectContaining({ key: '[REDACTED]' }),
        }),
      );
    });

    it('should handle error messages without error object', () => {
      loggerInstance.setLogLevel(LogLevel.ERROR);
      loggerInstance.error('Simple error message');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:ERROR]'),
        expect.objectContaining({
          error: undefined,
          context: undefined,
        }),
      );
    });
  });

  describe('security', () => {
    it('should always log security messages regardless of level', () => {
      loggerInstance.setLogLevel(LogLevel.NONE);
      loggerInstance.security('Security event', { event: 'login_attempt' });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:SECURITY]'),
        expect.objectContaining({
          timestamp: expect.any(String),
          details: expect.objectContaining({ event: 'login_attempt' }),
        }),
      );
    });

    it('should sanitize context in security messages', () => {
      loggerInstance.security('Security breach', {
        user: 'admin',
        password: 'compromised',
        ip: '192.168.1.1',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:SECURITY]'),
        expect.objectContaining({
          timestamp: expect.any(String),
          details: expect.objectContaining({
            user: 'admin',
            password: '[REDACTED]',
            ip: '192.168.1.1',
          }),
        }),
      );
    });

    it('should log security messages even when level is none', () => {
      loggerInstance.setLogLevel(LogLevel.NONE);
      loggerInstance.security('Critical security event');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:SECURITY]'),
        expect.objectContaining({
          timestamp: expect.any(String),
          details: undefined,
        }),
      );
    });
  });

  describe('logging without context', () => {
    it('should handle messages without context', () => {
      loggerInstance.setLogLevel(LogLevel.INFO);
      loggerInstance.info('Simple message');

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:INFO]'),
        undefined,
      );
    });

    it('should handle empty context', () => {
      loggerInstance.setLogLevel(LogLevel.INFO);
      loggerInstance.info('Message with empty context', {});

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BetterAuth:INFO]'),
        {},
      );
    });
  });
});
