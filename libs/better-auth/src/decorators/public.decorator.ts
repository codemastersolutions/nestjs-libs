import { SetMetadata } from '@nestjs/common';

export const PUBLIC_METADATA_KEY = 'isPublic';

/**
 * Decorator to mark routes as public (no authentication required)
 * Useful when there is a global authentication guard
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
