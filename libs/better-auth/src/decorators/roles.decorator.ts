import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

export const ROLES_METADATA_KEY = 'auth:roles';

/**
 * Decorator para proteger rotas baseado em roles/permissões
 * Automaticamente aplica autenticação também
 *
 * @param roles - Array de roles permitidas para acessar a rota
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
 * // Ou em métodos específicos
 * @Controller('content')
 * export class ContentController {
 *   @Get()
 *   getContent() {
 *     return { content: 'Conteúdo público' };
 *   }
 *
 *   @Roles(['editor', 'admin'])
 *   @Post()
 *   createContent() {
 *     return { message: 'Conteúdo criado' };
 *   }
 *
 *   @Roles(['admin'])
 *   @Delete(':id')
 *   deleteContent() {
 *     return { message: 'Conteúdo deletado' };
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
