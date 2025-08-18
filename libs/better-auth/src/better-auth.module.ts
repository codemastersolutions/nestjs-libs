import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';
import { BetterAuthController } from './better-auth.controller';
import { BetterAuthService } from './better-auth.service';
import {
  BetterAuthModuleAsyncOptions,
  BetterAuthModuleOptions,
  BetterAuthOptionsFactory,
} from './better-auth.types';

@Global()
@Module({})
export class BetterAuthModule {
  /**
   * Register Better Auth module synchronously
   */
  static forRoot(options: BetterAuthModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: BETTER_AUTH_OPTIONS,
        useValue: options,
      },
      {
        provide: BETTER_AUTH_INSTANCE,
        useValue: options.auth,
      },
      BetterAuthService,
    ];

    return {
      module: BetterAuthModule,
      controllers: [BetterAuthController],
      providers: providers,
      exports: [BetterAuthService, BETTER_AUTH_INSTANCE],
    };
  }

  /**
   * Register Better Auth module asynchronously
   */
  static forRootAsync(options: BetterAuthModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      ...this.createAsyncProviders(options),
      {
        provide: BETTER_AUTH_INSTANCE,
        useFactory: (moduleOptions: BetterAuthModuleOptions) => {
          return moduleOptions.auth;
        },
        inject: [BETTER_AUTH_OPTIONS],
      },
      BetterAuthService,
    ];

    return {
      module: BetterAuthModule,
      imports: options.imports || [],
      controllers: [BetterAuthController],
      providers: providers,
      exports: [BetterAuthService, BETTER_AUTH_INSTANCE],
    };
  }

  private static createAsyncProviders(
    options: BetterAuthModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: BetterAuthModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: BETTER_AUTH_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: BETTER_AUTH_OPTIONS,
      useFactory: async (optionsFactory: BetterAuthOptionsFactory) =>
        optionsFactory.createBetterAuthOptions(),
      inject: [options.useExisting || options.useClass!],
    };
  }
}
