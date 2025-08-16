import { ModuleMetadata, Type } from '@nestjs/common';
import { Auth } from 'better-auth';

export interface BetterAuthModuleOptions {
  auth: Auth;
  disableExceptionFilter?: boolean;
  disableTrustedOriginsCors?: boolean;
  disableBodyParser?: boolean;
  globalPrefix?: string;
  disableMiddleware?: boolean;
}

export interface BetterAuthOptionsFactory {
  createBetterAuthOptions():
    | Promise<BetterAuthModuleOptions>
    | BetterAuthModuleOptions;
}

export interface BetterAuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<BetterAuthOptionsFactory>;
  useClass?: Type<BetterAuthOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<BetterAuthModuleOptions> | BetterAuthModuleOptions;
  inject?: any[];
}
