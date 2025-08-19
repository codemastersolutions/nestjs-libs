import { Module } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { BetterAuthModule } from '../../libs/better-auth/src';
import { AppFastifyController } from './app.controller';
import { AppFastifyService } from './app.service';

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
  controllers: [AppFastifyController],
  providers: [AppFastifyService],
})
export class AppFastifyModule {}
