import { SetMetadata } from '@nestjs/common';

export const PUBLIC_METADATA_KEY = 'isPublic';

/**
 * Decorator para marcar rotas como públicas (não precisam autenticação)
 * Útil quando há um guard global de autenticação
 *
 * @example
 * ```typescript
 * @Controller('auth')
 * export class AuthController {
 *   @Public()
 *   @Post('login')
 *   login(@Body() loginDto: LoginDto) {
 *     return this.authService.login(loginDto);
 *   }
 *
 *   @Public()
 *   @Post('register')
 *   register(@Body() registerDto: RegisterDto) {
 *     return this.authService.register(registerDto);
 *   }
 *
 *   @Get('profile')
 *   getProfile(@User() user: any) {
 *     return { user };
 *   }
 * }
 * ```
 */
export const Public = () => SetMetadata(PUBLIC_METADATA_KEY, true);
