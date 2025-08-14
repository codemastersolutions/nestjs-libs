import { DynamicModule, Global, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { BETTER_AUTH_OPTIONS } from './better-auth.constants';
import { BetterAuthService } from './better-auth.service';
import { BetterAuthOptions } from './better-auth.types';

@Global()
@Module({
  providers: [BetterAuthService],
  exports: [BetterAuthService],
})
export class BetterAuthModule {
  static forRoot(options: BetterAuthOptions): DynamicModule {
    return {
      global: true,
      module: BetterAuthModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: BETTER_AUTH_OPTIONS,
          useValue: options,
        },
        BetterAuthService,
        DiscoveryService,
      ],
      exports: [BetterAuthService, DiscoveryService],
    };
  }
  static forRootAsync(options: BetterAuthOptions): DynamicModule {
    return {
      module: BetterAuthModule,
      providers: [
        {
          provide: BETTER_AUTH_OPTIONS,
          useValue: options,
        },
        BetterAuthService,
      ],
      exports: [BetterAuthService],
    };
  }
}
