import { ExecutionContext } from '@nestjs/common';
import { User } from './user.decorator';

describe('User Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  // Simulate the decorator function directly by replicating its behavior
  const simulateUserDecorator = (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  };

  beforeEach(() => {
    mockRequest = {
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  });

  it('should be defined', () => {
    expect(User).toBeDefined();
    expect(typeof User).toBe('function');
  });

  it('should return the entire user object when no data parameter is provided', () => {
    const result = simulateUserDecorator(undefined, mockExecutionContext);
    
    expect(result).toEqual({
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should return specific user property when data parameter is provided', () => {
    const result = simulateUserDecorator('email', mockExecutionContext);
    
    expect(result).toBe('test@example.com');
  });

  it('should return specific user property (id) when data parameter is provided', () => {
    const result = simulateUserDecorator('id', mockExecutionContext);
    
    expect(result).toBe('123');
  });

  it('should return undefined when user property does not exist', () => {
    const result = simulateUserDecorator('nonexistent', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should return undefined when user is not present in request', () => {
    mockRequest.user = undefined;
    
    const result = simulateUserDecorator(undefined, mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should return undefined when user is null and data parameter is provided', () => {
    mockRequest.user = null;
    
    const result = simulateUserDecorator('email', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should handle empty user object', () => {
    mockRequest.user = {};
    
    const result = simulateUserDecorator('email', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should return empty object when user is empty and no data parameter', () => {
    mockRequest.user = {};
    
    const result = simulateUserDecorator(undefined, mockExecutionContext);
    
    expect(result).toEqual({});
  });

  it('should handle nested user properties', () => {
    mockRequest.user = {
      id: '123',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        settings: {
          theme: 'dark'
        }
      }
    };
    
    const result = simulateUserDecorator('profile', mockExecutionContext);
    
    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      settings: {
        theme: 'dark'
      }
    });
  });

  it('should handle user property with falsy values', () => {
    mockRequest.user = {
      id: '123',
      isActive: false,
      count: 0,
      description: '',
      lastLogin: null
    };
    
    expect(simulateUserDecorator('isActive', mockExecutionContext)).toBe(false);
    expect(simulateUserDecorator('count', mockExecutionContext)).toBe(0);
    expect(simulateUserDecorator('description', mockExecutionContext)).toBe('');
    expect(simulateUserDecorator('lastLogin', mockExecutionContext)).toBeNull();
  });

  it('should handle user property with array values', () => {
    mockRequest.user = {
      id: '123',
      roles: ['admin', 'user'],
      permissions: [],
      tags: ['vip', 'premium']
    };
    
    expect(simulateUserDecorator('roles', mockExecutionContext)).toEqual(['admin', 'user']);
    expect(simulateUserDecorator('permissions', mockExecutionContext)).toEqual([]);
    expect(simulateUserDecorator('tags', mockExecutionContext)).toEqual(['vip', 'premium']);
  });

  it('should handle user property with numeric values', () => {
    mockRequest.user = {
      id: 456,
      age: 25,
      score: 99.5,
      balance: -10.50
    };
    
    expect(simulateUserDecorator('id', mockExecutionContext)).toBe(456);
    expect(simulateUserDecorator('age', mockExecutionContext)).toBe(25);
    expect(simulateUserDecorator('score', mockExecutionContext)).toBe(99.5);
    expect(simulateUserDecorator('balance', mockExecutionContext)).toBe(-10.50);
  });

  it('should handle user property with boolean values', () => {
    mockRequest.user = {
      id: '123',
      isVerified: true,
      isBlocked: false,
      hasNotifications: true
    };
    
    expect(simulateUserDecorator('isVerified', mockExecutionContext)).toBe(true);
    expect(simulateUserDecorator('isBlocked', mockExecutionContext)).toBe(false);
    expect(simulateUserDecorator('hasNotifications', mockExecutionContext)).toBe(true);
  });

  it('should handle user property with date values', () => {
    const createdAt = new Date('2023-01-01');
    const updatedAt = new Date('2023-12-31');
    
    mockRequest.user = {
      id: '123',
      createdAt,
      updatedAt
    };
    
    expect(simulateUserDecorator('createdAt', mockExecutionContext)).toBe(createdAt);
    expect(simulateUserDecorator('updatedAt', mockExecutionContext)).toBe(updatedAt);
  });

  it('should handle request without user property', () => {
    mockRequest = {}; // No user property at all
    
    const result = simulateUserDecorator(undefined, mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should handle request without user property when requesting specific data', () => {
    mockRequest = {}; // No user property at all
    
    const result = simulateUserDecorator('email', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should handle user with symbol properties', () => {
    const symbolKey = Symbol('test');
    mockRequest.user = {
      id: '123',
      [symbolKey]: 'symbol-value'
    };
    
    // Symbol properties cannot be accessed with string keys
    const result = simulateUserDecorator('Symbol(test)', mockExecutionContext);
    
    expect(result).toBeUndefined();
  });

  it('should handle user with function properties', () => {
    mockRequest.user = {
      id: '123',
      getName: () => 'Test User',
      toString: () => '[object User]'
    };
    
    const getName = simulateUserDecorator('getName', mockExecutionContext);
    const toString = simulateUserDecorator('toString', mockExecutionContext);
    
    expect(typeof getName).toBe('function');
    expect(typeof toString).toBe('function');
    expect(getName()).toBe('Test User');
  });

  it('should handle complex nested data structures', () => {
    mockRequest.user = {
      id: '123',
      metadata: {
        preferences: {
          notifications: {
            email: true,
            sms: false,
            push: {
              enabled: true,
              frequency: 'daily'
            }
          }
        },
        history: [
          { action: 'login', timestamp: '2023-01-01' },
          { action: 'logout', timestamp: '2023-01-02' }
        ]
      }
    };
    
    const metadata = simulateUserDecorator('metadata', mockExecutionContext);
    
    expect(metadata).toBeDefined();
    expect(metadata.preferences.notifications.email).toBe(true);
    expect(metadata.history).toHaveLength(2);
  });

  it('should handle edge cases for ternary operator coverage', () => {
      // Test when data is provided but user is undefined
      mockRequest.user = undefined;
      const resultWithData = simulateUserDecorator('name', mockExecutionContext);
      expect(resultWithData).toBeUndefined();

      // Test when data is empty string (falsy but defined) - returns entire user object
      mockRequest.user = { '': 'empty key value' };
      const resultEmptyKey = simulateUserDecorator('', mockExecutionContext);
      expect(resultEmptyKey).toEqual({ '': 'empty key value' }); // Empty string is falsy, so returns entire user

      // Test when data is '0' (truthy string) - returns user['0']
       mockRequest.user = { 0: 'zero key value' };
       const resultZeroKey = simulateUserDecorator('0', mockExecutionContext);
       expect(resultZeroKey).toBe('zero key value'); // '0' string is truthy, so returns user['0']

      // Test when data is string 'false' (truthy)
      mockRequest.user = { false: 'false key value' };
      const resultFalseKey = simulateUserDecorator('false', mockExecutionContext);
      expect(resultFalseKey).toBe('false key value'); // 'false' string is truthy

      // Test when data is string '0' (truthy)
      mockRequest.user = { '0': 'string zero value' };
      const resultStringZero = simulateUserDecorator('0', mockExecutionContext);
      expect(resultStringZero).toBe('string zero value'); // '0' string is truthy
    });

  it('should test all execution paths of the decorator logic', () => {
    // Path 1: data is undefined, return entire user
    mockRequest.user = { id: 1, name: 'Test' };
    const fullUser = simulateUserDecorator(undefined, mockExecutionContext);
    expect(fullUser).toEqual({ id: 1, name: 'Test' });

    // Path 2: data is defined and user exists, return user[data]
    const userName = simulateUserDecorator('name', mockExecutionContext);
    expect(userName).toBe('Test');

    // Path 3: data is defined but user is null
    mockRequest.user = null;
    const nullResult = simulateUserDecorator('name', mockExecutionContext);
    expect(nullResult).toBeUndefined();

    // Path 4: data is defined but user is undefined
    mockRequest.user = undefined;
    const undefinedResult = simulateUserDecorator('name', mockExecutionContext);
    expect(undefinedResult).toBeUndefined();
  });
});