import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

export const AUTH_METADATA_KEY = 'auth:required';

/**
 * Decorator para proteger rotas que requerem autenticação
 * Pode ser aplicado em classes ou métodos de controller
 *
 * @example
 * ```typescript
 * @AuthRequired()
 * @Controller('protected')
 * export class ProtectedController {
 *   @Get()
 *   getProtectedData() {
 *     return { message: 'Dados protegidos' };
 *   }
 * }
 *
 * // Ou em métodos específicos
 * @Controller('mixed')
 * export class MixedController {
 *   @Get('public')
 *   getPublicData() {
 *     return { message: 'Dados públicos' };
 *   }
 *
 *   @AuthRequired()
 *   @Get('private')
 *   getPrivateData() {
 *     return { message: 'Dados privados' };
 *   }
 * }
 * ```
 */
export function AuthRequired() {
  return applyDecorators(
    SetMetadata(AUTH_METADATA_KEY, true),
    UseGuards(AuthGuard),
  );
}
