import { BetterAuthModule } from '@nestjs-libs/better-auth';
import { Module } from '@nestjs/common';
import { AppFastifyController } from './app.controller';
import { AppFastifyService } from './app.service';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      apiKey: '123',
    }),
  ],
  controllers: [AppFastifyController],
  providers: [AppFastifyService],
})
export class AppFastifyModule {}
