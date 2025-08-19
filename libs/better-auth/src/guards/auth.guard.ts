import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { FastifyRequest } from 'fastify';
import { BetterAuthService } from '../better-auth.service';
import { PUBLIC_METADATA_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly betterAuthService: BetterAuthService,
    @Optional() private readonly reflector?: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar se a rota é pública
    const isPublic = this.reflector?.getAllAndOverride<boolean>(
      PUBLIC_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request | FastifyRequest>();

    try {
      const session = await this.betterAuthService.getSession(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        request as any,
      );

      if (!session?.user) {
        throw new UnauthorizedException('Usuário não autenticado');
      }

      // Adiciona usuário e sessão ao request para uso posterior
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request as any).user = session.user;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request as any).session = session;

      return true;
    } catch {
      throw new UnauthorizedException('Token de autenticação inválido');
    }
  }
}
