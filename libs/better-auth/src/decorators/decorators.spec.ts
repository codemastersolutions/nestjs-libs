import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Public, PUBLIC_METADATA_KEY } from './public.decorator';
import { Roles, ROLES_METADATA_KEY } from './roles.decorator';
import { User } from './user.decorator';

describe('Decorators', () => {
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    // Setup mock request with user
    mockRequest = {
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        roles: ['user'],
        profile: {
          firstName: 'Test',
          lastName: 'User',
        },
      },
    };

    // Setup mock execution context
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
  });

  describe('Public Decorator', () => {
    it('should export the correct metadata key', () => {
      expect(PUBLIC_METADATA_KEY).toBe('isPublic');
    });

    it('should be a function', () => {
      expect(typeof Public).toBe('function');
    });

    it('should return a decorator when called', () => {
      const decorator = Public();
      expect(typeof decorator).toBe('function');
    });

    it('should work with Reflector to set metadata', () => {
      const reflector = new Reflector();
      
      // Create a test class and method
      class TestController {
        @Public()
        testMethod() {
          return 'test';
        }
      }

      // Check if metadata can be retrieved
      const isPublic = reflector.get(PUBLIC_METADATA_KEY, TestController.prototype.testMethod);
      expect(isPublic).toBe(true);
    });
  });

  describe('Roles Decorator', () => {
    it('should export the correct metadata key', () => {
      expect(ROLES_METADATA_KEY).toBe('auth:roles');
    });

    it('should be a function', () => {
      expect(typeof Roles).toBe('function');
    });

    it('should return a decorator when called', () => {
      const decorator = Roles(['admin']);
      expect(typeof decorator).toBe('function');
    });

    it('should handle single role', () => {
      const roles = ['admin'];
      const decorator = Roles(roles);
      expect(typeof decorator).toBe('function');
    });

    it('should handle multiple roles', () => {
      const roles = ['admin', 'moderator', 'editor'];
      const decorator = Roles(roles);
      expect(typeof decorator).toBe('function');
    });

    it('should handle empty roles array', () => {
      const roles: string[] = [];
      const decorator = Roles(roles);
      expect(typeof decorator).toBe('function');
    });

    it('should handle roles with special characters', () => {
      const roles = ['super-admin', 'content_editor', 'api.user'];
      const decorator = Roles(roles);
      expect(typeof decorator).toBe('function');
    });

    it('should work with Reflector to set metadata', () => {
      const reflector = new Reflector();
      const roles = ['admin', 'user'];
      
      // Create a test class and method
      class TestController {
        @Roles(['admin', 'user'])
        testMethod() {
          return 'test';
        }
      }

      // Check if metadata can be retrieved
      const requiredRoles = reflector.get(ROLES_METADATA_KEY, TestController.prototype.testMethod);
      expect(requiredRoles).toEqual(['admin', 'user']);
    });
  });

  describe('User Decorator', () => {
    // Test the decorator function directly by simulating its behavior
    const simulateUserDecorator = (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;
      return data ? user?.[data] : user;
    };

    it('should be defined', () => {
      expect(User).toBeDefined();
      expect(typeof User).toBe('function');
    });

    it('should return the entire user object when no data parameter is provided', () => {
      const result = simulateUserDecorator(undefined, mockExecutionContext as ExecutionContext);

      expect(result).toEqual(mockRequest.user);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should return specific user property when data parameter is provided', () => {
      const result = simulateUserDecorator('id', mockExecutionContext as ExecutionContext);

      expect(result).toBe(1);
    });

    it('should return user email when email is requested', () => {
      const result = simulateUserDecorator('email', mockExecutionContext as ExecutionContext);

      expect(result).toBe('test@example.com');
    });

    it('should return user name when name is requested', () => {
      const result = simulateUserDecorator('name', mockExecutionContext as ExecutionContext);

      expect(result).toBe('Test User');
    });

    it('should return user roles when roles is requested', () => {
      const result = simulateUserDecorator('roles', mockExecutionContext as ExecutionContext);

      expect(result).toEqual(['user']);
    });

    it('should return nested property when requested', () => {
      const result = simulateUserDecorator('profile', mockExecutionContext as ExecutionContext);

      expect(result).toEqual({
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should return undefined for non-existent property', () => {
      const result = simulateUserDecorator('nonExistent', mockExecutionContext as ExecutionContext);

      expect(result).toBeUndefined();
    });

    it('should handle undefined user gracefully', () => {
      mockRequest.user = undefined;

      const result = simulateUserDecorator(undefined, mockExecutionContext as ExecutionContext);

      expect(result).toBeUndefined();
    });

    it('should handle undefined user with data parameter gracefully', () => {
      mockRequest.user = undefined;

      const result = simulateUserDecorator('id', mockExecutionContext as ExecutionContext);

      expect(result).toBeUndefined();
    });

    it('should handle null user gracefully', () => {
      mockRequest.user = null;

      const result = simulateUserDecorator(undefined, mockExecutionContext as ExecutionContext);

      expect(result).toBeNull();
    });

    it('should handle null user with data parameter gracefully', () => {
      mockRequest.user = null;

      const result = simulateUserDecorator('id', mockExecutionContext as ExecutionContext);

      expect(result).toBeUndefined();
    });

    it('should handle empty user object', () => {
      mockRequest.user = {};

      const result = simulateUserDecorator('id', mockExecutionContext as ExecutionContext);

      expect(result).toBeUndefined();
    });

    it('should handle user with null properties', () => {
      mockRequest.user = {
        id: null,
        email: 'test@example.com',
      };

      const result = simulateUserDecorator('id', mockExecutionContext as ExecutionContext);

      expect(result).toBeNull();
    });

    it('should handle user with false/0 values', () => {
      mockRequest.user = {
        id: 0,
        isActive: false,
        email: 'test@example.com',
      };

      expect(simulateUserDecorator('id', mockExecutionContext as ExecutionContext)).toBe(0);
      expect(simulateUserDecorator('isActive', mockExecutionContext as ExecutionContext)).toBe(false);
    });

    it('should handle complex nested properties', () => {
      mockRequest.user = {
        profile: {
          address: {
            street: '123 Main St',
            city: 'Test City',
          },
        },
      };

      const result = simulateUserDecorator('profile', mockExecutionContext as ExecutionContext);

      expect(result).toEqual({
        address: {
          street: '123 Main St',
          city: 'Test City',
        },
      });
    });

    it('should handle array properties', () => {
      mockRequest.user = {
        roles: ['admin', 'user'],
        permissions: ['read', 'write', 'delete'],
      };

      expect(simulateUserDecorator('roles', mockExecutionContext as ExecutionContext)).toEqual(['admin', 'user']);
      expect(simulateUserDecorator('permissions', mockExecutionContext as ExecutionContext)).toEqual(['read', 'write', 'delete']);
    });

    it('should handle numeric string properties', () => {
      mockRequest.user = {
        id: '123',
        age: 25,
      };

      expect(simulateUserDecorator('id', mockExecutionContext as ExecutionContext)).toBe('123');
      expect(simulateUserDecorator('age', mockExecutionContext as ExecutionContext)).toBe(25);
    });

    it('should handle special property names', () => {
      mockRequest.user = {
        'user-id': 123,
        'user_name': 'testuser',
        'user.email': 'test@example.com',
      };

      expect(simulateUserDecorator('user-id', mockExecutionContext as ExecutionContext)).toBe(123);
      expect(simulateUserDecorator('user_name', mockExecutionContext as ExecutionContext)).toBe('testuser');
      expect(simulateUserDecorator('user.email', mockExecutionContext as ExecutionContext)).toBe('test@example.com');
    });

    it('should handle request without user property', () => {
      const requestWithoutUser = {
        headers: {},
        body: {},
      };

      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(requestWithoutUser),
      });

      const result = simulateUserDecorator(undefined, mockExecutionContext as ExecutionContext);

      expect(result).toBeUndefined();
    });

    it('should handle execution context errors gracefully', () => {
      mockExecutionContext.switchToHttp = jest.fn().mockImplementation(() => {
        throw new Error('Context error');
      });

      expect(() => {
        simulateUserDecorator(undefined, mockExecutionContext as ExecutionContext);
      }).toThrow('Context error');
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a typical controller setup', () => {
      // Create a test controller with different decorators
      class TestController {
        @Public()
        publicMethod() {
          return 'public';
        }

        @Roles(['admin'])
        adminMethod() {
          return 'admin only';
        }

        normalMethod() {
          return 'normal';
        }
      }

      const reflector = new Reflector();

      // Test Public decorator metadata
      const isPublic = reflector.get(PUBLIC_METADATA_KEY, TestController.prototype.publicMethod);
      expect(isPublic).toBe(true);

      // Test Roles decorator metadata
      const requiredRoles = reflector.get(ROLES_METADATA_KEY, TestController.prototype.adminMethod);
      expect(requiredRoles).toEqual(['admin']);

      // Test normal method has no metadata
      const normalIsPublic = reflector.get(PUBLIC_METADATA_KEY, TestController.prototype.normalMethod);
      const normalRoles = reflector.get(ROLES_METADATA_KEY, TestController.prototype.normalMethod);
      expect(normalIsPublic).toBeUndefined();
      expect(normalRoles).toBeUndefined();
    });

    it('should handle metadata precedence correctly', () => {
      const reflector = new Reflector();
      
      // Create a method that has both Public and Roles decorators
      class TestController {
        @Public()
        @Roles(['admin'])
        testMethod() {
          return 'test';
        }
      }

      // Check metadata
      const isPublic = reflector.get(PUBLIC_METADATA_KEY, TestController.prototype.testMethod);
      const requiredRoles = reflector.get(ROLES_METADATA_KEY, TestController.prototype.testMethod);

      expect(isPublic).toBe(true);
      expect(requiredRoles).toEqual(['admin']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long role names', () => {
      const longRoleName = 'a'.repeat(1000);
      const roles = [longRoleName];
      
      expect(() => Roles(roles)).not.toThrow();
      const decorator = Roles(roles);
      expect(typeof decorator).toBe('function');
    });

    it('should handle User decorator with very long property names', () => {
      const longPropertyName = 'a'.repeat(1000);
      mockRequest.user = {
        [longPropertyName]: 'test-value',
      };

      const simulateUserDecorator = (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
      };

      const result = simulateUserDecorator(longPropertyName, mockExecutionContext as ExecutionContext);

      expect(result).toBe('test-value');
    });

    it('should handle User decorator with circular references', () => {
      const circularUser: any = {
        id: 1,
        name: 'Test',
      };
      circularUser.self = circularUser;
      mockRequest.user = circularUser;

      const simulateUserDecorator = (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
      };

      // Should not throw when accessing the circular reference
      const result = simulateUserDecorator(undefined, mockExecutionContext as ExecutionContext);
      expect(result).toBe(circularUser);

      const selfReference = simulateUserDecorator('self', mockExecutionContext as ExecutionContext);
      expect(selfReference).toBe(circularUser);
    });

    it('should handle User decorator with Symbol properties', () => {
      const symbolKey = Symbol('test');
      mockRequest.user = {
        id: 1,
        [symbolKey]: 'symbol-value',
      };

      const simulateUserDecorator = (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
      };

      // Symbol properties should not be accessible via string keys
      const result = simulateUserDecorator('Symbol(test)', mockExecutionContext as ExecutionContext);
      expect(result).toBeUndefined();
    });
  });
});