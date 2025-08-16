import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  RequestMethod,
} from '@nestjs/common';
import {
  BETTER_AUTH_INSTANCE,
  BETTER_AUTH_OPTIONS,
} from './better-auth.constants';
import { BetterAuthMiddleware } from './better-auth.middleware';
import { BetterAuthService } from './better-auth.service';
import {
  BetterAuthModuleAsyncOptions,
  BetterAuthModuleOptions,
  BetterAuthOptionsFactory,
} from './better-auth.types';

@Global()
@Module({})
export class BetterAuthModule implements NestModule {
  private static moduleOptions: BetterAuthModuleOptions;

  configure(consumer: MiddlewareConsumer) {
    // Only apply middleware if not disabled
    if (!BetterAuthModule.moduleOptions?.disableMiddleware) {
      consumer
        .apply(BetterAuthMiddleware)
        .forRoutes(
          { path: 'api/auth', method: RequestMethod.ALL },
          { path: 'api/auth/*path', method: RequestMethod.ALL },
          { path: '/api/auth', method: RequestMethod.ALL },
          { path: '/api/auth/*path', method: RequestMethod.ALL },
        );
    }
  }
  /**
   * Register Better Auth module synchronously
   */
  static forRoot(options: BetterAuthModuleOptions): DynamicModule {
    // Store options for middleware configuration
    BetterAuthModule.moduleOptions = options;

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
      providers: [...providers, BetterAuthMiddleware],
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
          // Store options for middleware configuration
          BetterAuthModule.moduleOptions = moduleOptions;
          return moduleOptions.auth;
        },
        inject: [BETTER_AUTH_OPTIONS],
      },
      BetterAuthService,
    ];

    return {
      module: BetterAuthModule,
      imports: options.imports || [],
      providers: [...providers, BetterAuthMiddleware],
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
