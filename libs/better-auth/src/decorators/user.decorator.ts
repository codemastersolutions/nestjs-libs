import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the authenticated user from the request
 * Should be used together with authentication guards
 *
 * @example
 * ```typescript
 * @Controller('profile')
 * export class ProfileController {
 *   @AuthRequired()
 *   @Get()
 *   getProfile(@User() user: any) {
 *     return { user };
 *   }
 *
 *   @AuthRequired()
 *   @Get('id')
 *   getUserId(@User('id') userId: string) {
 *     return { userId };
 *   }
 * }
 * ```
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = request.user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return data ? user?.[data] : user;
  },
);
