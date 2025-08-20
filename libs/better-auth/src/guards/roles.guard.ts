import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';

/**
 * Interface representing a user with roles
 */
interface UserWithRoles {
  roles?: string[];
  [key: string]: unknown;
}

/**
 * Interface representing a request with user data
 */
interface RequestWithUser {
  user?: UserWithRoles;
  [key: string]: unknown;
}

/**
 * Guard that handles role-based authorization
 * Checks if the authenticated user has the required roles to access a route
 * Should be used after AuthGuard to ensure user is authenticated
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Creates an instance of RolesGuard
   * @param reflector - Reflector to read metadata from decorators
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Determines if the current request should be allowed based on user roles
   * @param context - The execution context containing request information
   * @returns boolean - True if access is allowed
   * @throws ForbiddenException When user is not found or doesn't have required roles
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const userRoles = user.roles || [];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
