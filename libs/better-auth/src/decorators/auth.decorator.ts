import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

export const AUTH_METADATA_KEY = 'auth:required';

/**
 * Decorator to protect routes that require authentication
 * Can be applied to controller classes or methods
 *
 * @example
 * ```typescript
 * @AuthRequired()
 * @Controller('protected')
 * export class ProtectedController {
 *   @Get()
 *   getProtectedData() {
 *     return { message: 'Protected data' };
 *   }
 * }
 *
 * // Or on specific methods
 * @Controller('mixed')
 * export class MixedController {
 *   @Get('public')
 *   getPublicData() {
 *     return { message: 'Public data' };
 *   }
 *
 *   @AuthRequired()
 *   @Get('private')
 *   getPrivateData() {
 *     return { message: 'Private data' };
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
