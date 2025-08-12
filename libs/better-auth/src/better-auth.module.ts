import { Module } from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';

@Module({
  providers: [BetterAuthService],
  exports: [BetterAuthService],
})
export class BetterAuthModule {}
