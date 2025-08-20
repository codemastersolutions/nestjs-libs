import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

export const ROLES_METADATA_KEY = 'auth:roles';

/**
 * Decorator to protect routes based on roles/permissions
 * Automatically applies authentication as well
 *
 * @param roles - Array of roles allowed to access the route
 *
 * @example
 * ```typescript
 * @Roles(['admin', 'moderator'])
 * @Controller('admin')
 * export class AdminController {
 *   @Get('users')
 *   getUsers() {
 *     return { users: [] };
 *   }
 * }
 *
 * // Or on specific methods
 * @Controller('content')
 * export class ContentController {
 *   @Get()
 *   getContent() {
 *     return { content: 'Public content' };
 *   }
 *
 *   @Roles(['editor', 'admin'])
 *   @Post()
 *   createContent() {
 *     return { message: 'Content created' };
 *   }
 *
 *   @Roles(['admin'])
 *   @Delete(':id')
 *   deleteContent() {
 *     return { message: 'Content deleted' };
 *   }
 * }
 * ```
 */
export function Roles(roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_METADATA_KEY, roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
