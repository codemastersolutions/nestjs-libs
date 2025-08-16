import { Module } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { BetterAuthModule } from '../../libs/better-auth/src';
import { AppExpressController } from './app.controller';
import { AppExpressService } from './app.service';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      useFactory: () => {
        const auth = betterAuth({
          secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key',
          baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3900',
          emailAndPassword: {
            enabled: true,
          },
          plugins: [openAPI()],
        });

        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          auth: auth as any,
          disableExceptionFilter: false,
        };
      },
    }),
  ],
  controllers: [AppExpressController],
  providers: [AppExpressService],
})
export class AppExpressModule {}
