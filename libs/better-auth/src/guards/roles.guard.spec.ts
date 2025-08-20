import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);

    // Setup mock request
    mockRequest = {
      user: {
        id: 1,
        email: 'test@example.com',
        roles: ['user'],
      },
    };

    // Setup mock execution context
    mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      // Mock reflector to return no required roles
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        ROLES_METADATA_KEY,
        [mockExecutionContext.getHandler!(), mockExecutionContext.getClass!()]
      );
    });

    it('should allow access when no roles are required (empty array)', () => {
      // Mock reflector to return empty array
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has required role', () => {
      // Mock reflector to return required roles
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has one of multiple required roles', () => {
      // User has 'user' role, required roles are 'admin' or 'user'
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'user']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has multiple roles and one matches', () => {
      // User has multiple roles
      mockRequest.user.roles = ['user', 'editor', 'viewer'];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['editor']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has admin role and any role is required', () => {
      mockRequest.user.roles = ['admin'];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user', 'editor', 'admin']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not found in request', () => {
      // Remove user from request
      mockRequest.user = undefined;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('User not found in request');
    });

    it('should throw ForbiddenException when user is null', () => {
      mockRequest.user = null;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('User not found in request');
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      // User has 'user' role but 'admin' is required
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('Access denied. Required roles: admin');
    });

    it('should throw ForbiddenException when user does not have any of multiple required roles', () => {
      // User has 'user' role but 'admin' or 'moderator' is required
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'moderator']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('Access denied. Required roles: admin, moderator');
    });

    it('should handle user with no roles property', () => {
      // User object without roles property
      mockRequest.user = {
        id: 1,
        email: 'test@example.com',
        // No roles property
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('Access denied. Required roles: user');
    });

    it('should handle user with empty roles array', () => {
      mockRequest.user.roles = [];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('Access denied. Required roles: user');
    });

    it('should handle user with null roles', () => {
      mockRequest.user.roles = null;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('Access denied. Required roles: user');
    });

    it('should be case-sensitive when matching roles', () => {
      mockRequest.user.roles = ['User']; // Capital U
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']); // lowercase u

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('Access denied. Required roles: user');
    });

    it('should handle complex role names', () => {
      mockRequest.user.roles = ['super-admin', 'content_editor', 'api.user'];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['content_editor']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle single required role as string array', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user.roles = ['admin'];

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should work with different user object structures', () => {
      // User with additional properties
      mockRequest.user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        profile: {
          firstName: 'Test',
          lastName: 'User',
        },
        roles: ['editor'],
        permissions: ['read', 'write'],
        isActive: true,
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['editor']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });
  });

  describe('reflector integration', () => {
    it('should call reflector with correct parameters', () => {
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);
      const mockHandler = jest.fn();
      const mockClass = jest.fn();

      mockExecutionContext.getHandler = jest.fn().mockReturnValue(mockHandler);
      mockExecutionContext.getClass = jest.fn().mockReturnValue(mockClass);

      guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(
        ROLES_METADATA_KEY,
        [mockHandler, mockClass]
      );
    });

    it('should handle reflector returning different data types', () => {
      // Test with null
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
      expect(guard.canActivate(mockExecutionContext as ExecutionContext)).toBe(true);

      // Test with undefined
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      expect(guard.canActivate(mockExecutionContext as ExecutionContext)).toBe(true);

      // Test with empty array
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
      expect(guard.canActivate(mockExecutionContext as ExecutionContext)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw ForbiddenException with correct message for single role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user.roles = ['user'];

      try {
        guard.canActivate(mockExecutionContext as ExecutionContext);
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Access denied. Required roles: admin');
      }
    });

    it('should throw ForbiddenException with correct message for multiple roles', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'moderator', 'editor']);
      mockRequest.user.roles = ['user'];

      try {
        guard.canActivate(mockExecutionContext as ExecutionContext);
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Access denied. Required roles: admin, moderator, editor');
      }
    });

    it('should handle execution context errors gracefully', () => {
      // Mock execution context to throw error
      mockExecutionContext.switchToHttp = jest.fn().mockImplementation(() => {
        throw new Error('Context error');
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('Context error');
    });
  });

  describe('edge cases', () => {
    it('should handle request without user property', () => {
      // Request object without user property
      const requestWithoutUser = {
        headers: {},
        body: {},
        // No user property
      };

      mockExecutionContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(requestWithoutUser),
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow('User not found in request');
    });

    it('should handle roles as non-array values', () => {
      // User with roles as string instead of array
      mockRequest.user.roles = 'admin' as any;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      expect(() => {
        guard.canActivate(mockExecutionContext as ExecutionContext);
      }).toThrow(ForbiddenException);
    });

    it('should handle roles with non-string values', () => {
      mockRequest.user.roles = [1, 2, 'user'] as any;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle very long role names', () => {
      const longRoleName = 'a'.repeat(1000);
      mockRequest.user.roles = [longRoleName];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([longRoleName]);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle special characters in role names', () => {
      const specialRoles = ['role@domain.com', 'role#123', 'role$special', 'role with spaces'];
      mockRequest.user.roles = specialRoles;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['role@domain.com']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle empty string roles', () => {
      mockRequest.user.roles = ['', 'user', ''];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle duplicate roles in user roles array', () => {
      mockRequest.user.roles = ['user', 'user', 'admin', 'user'];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle duplicate roles in required roles array', () => {
      mockRequest.user.roles = ['admin'];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'admin', 'user', 'admin']);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });
  });
});