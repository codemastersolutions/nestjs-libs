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
          baseURL: 'http://localhost:3901',
          basePath: '/api/auth',
          secret: 'better-auth-secret-key-for-testing',
          emailAndPassword: {
            enabled: true,
          },
          plugins: [openAPI()],
        });
        return {
          auth,
        };
      },
    }),
  ],
  controllers: [AppExpressController],
  providers: [AppExpressService],
})
export class AppExpressModule {}
