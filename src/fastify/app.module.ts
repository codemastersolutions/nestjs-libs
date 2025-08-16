import { Module } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { BetterAuthModule } from '../../libs/better-auth/src';
import { AppFastifyController } from './app.controller';
import { AppFastifyService } from './app.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      useFactory: () => {
        const auth = betterAuth({
          secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key',
          baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3901',
          emailAndPassword: {
            enabled: true,
          },
          plugins: [openAPI()],
        });

        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          auth: auth as any,
          disableExceptionFilter: false,
          disableMiddleware: true, // Disable middleware for Fastify
        };
      },
    }),
  ],
  controllers: [AppFastifyController, AuthController],
  providers: [AppFastifyService],
})
export class AppFastifyModule {}
