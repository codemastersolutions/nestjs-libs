import { BetterAuthModule } from '@nestjs-libs/better-auth';
import { Module } from '@nestjs/common';
import { AppExpressController } from './app.controller';
import { AppExpressService } from './app.service';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      apiKey: '123',
    }),
  ],
  controllers: [AppExpressController],
  providers: [AppExpressService],
})
export class AppExpressModule {}
