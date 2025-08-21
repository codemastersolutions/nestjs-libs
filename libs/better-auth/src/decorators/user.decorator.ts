import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the authenticated user from the request
 * Should be used together with authentication guards
 *
 * @template TUser - The type of the user object
 * @template TKey - The key of the user object to extract (optional)
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   email: string;
 *   name: string;
 * }
 *
 * @Controller('profile')
 * export class ProfileController {
 *   @AuthRequired()
 *   @Get()
 *   getProfile(@User<User>() user: User) {
 *     return { user };
 *   }
 *
 *   @AuthRequired()
 *   @Get('id')
 *   getUserId(@User<User, 'id'>('id') userId: string) {
 *     return { userId };
 *   }
 *
 *   @AuthRequired()
 *   @Get('email')
 *   getUserEmail(@User<User, 'email'>('email') email: string) {
 *     return { email };
 *   }
 * }
 * ```
 */
export const User = createParamDecorator(
  <TUser = any, TKey extends keyof TUser = keyof TUser>(
    data: TKey | undefined,
    ctx: ExecutionContext,
  ): TKey extends undefined ? TUser : TUser[TKey] => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: TUser = request.user;

    return (data ? user?.[data] : user) as TKey extends undefined
      ? TUser
      : TUser[TKey];
  },
);
