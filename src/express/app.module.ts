import { Module } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { BetterAuthModule } from '../../libs/better-auth/src';
import { AppExpressController } from './app.controller';
import { AppExpressService } from './app.service';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth: betterAuth({
        emailAndPassword: {
          enabled: true,
        },
        plugins: [openAPI()],
      }),
    }),
  ],
  controllers: [AppExpressController],
  providers: [AppExpressService],
})
export class AppExpressModule {}
