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
