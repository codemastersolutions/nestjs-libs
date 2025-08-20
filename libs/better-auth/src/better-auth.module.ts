import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
import { AuthGuard } from './guards/auth.guard';

/**
 * Better Auth module for NestJS applications
 * Provides authentication functionality with support for multiple frameworks
 * This is a global module that exports authentication services and guards
 */
@Global()
@Module({})
export class BetterAuthModule {
  /**
   * Registers Better Auth module synchronously with provided options
   * @param options - Better Auth configuration options
   * @returns Dynamic module configuration
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
      Reflector,
      AuthGuard,
    ];

    return {
      module: BetterAuthModule,
      controllers: [BetterAuthController],
      providers: providers,
      exports: [BetterAuthService, BETTER_AUTH_INSTANCE, AuthGuard],
    };
  }

  /**
   * Registers Better Auth module asynchronously with factory or existing providers
   * @param options - Async configuration options (factory, existing provider, or class)
   * @returns Dynamic module configuration
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
      Reflector,
      AuthGuard,
    ];

    return {
      module: BetterAuthModule,
      imports: options.imports || [],
      controllers: [BetterAuthController],
      providers: providers,
      exports: [BetterAuthService, BETTER_AUTH_INSTANCE, AuthGuard],
    };
  }

  /**
   * Creates async providers for Better Auth module
   * @param options - Async configuration options
   * @returns Array of providers for dependency injection
   */
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

  /**
   * Creates the async options provider based on configuration type
   * @param options - Async configuration options
   * @returns Provider for Better Auth options
   */
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
