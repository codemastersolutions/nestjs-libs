import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BetterAuthService } from './better-auth.service';

@Injectable()
export class BetterAuthGuard implements CanActivate {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request | FastifyRequest>();
    const response = ctx.getResponse<Response | FastifyReply>();

    const options = this.betterAuthService.getOptions();
    const authPath = options.globalPrefix
      ? `/${options.globalPrefix}/api/auth`
      : '/api/auth';

    // Get the request path
    let requestPath = '';
    if ('path' in request) {
      // Express case
      requestPath = request.path;
    } else {
      // Fastify case
      requestPath = request.url.split('?')[0];
    }

    console.log('[BetterAuthGuard] Request received:', {
      path: requestPath,
      method: request.method,
      authPath,
    });

    // Check if this is an auth route
    if (requestPath.startsWith(authPath)) {
      try {
        // Create a Web API compatible request object
        const protocol =
          'protocol' in request ? (request as Request).protocol : 'http';
        const host = request.headers.host || 'localhost';
        const originalUrl =
          'originalUrl' in request
            ? (request as Request).originalUrl
            : (request as FastifyRequest).url;
        const method = request.method || 'GET';

        const webRequest = new Request(`${protocol}://${host}${originalUrl}`, {
          method,
          headers: new Headers(request.headers as Record<string, string>),
          body:
            method !== 'GET' &&
            method !== 'HEAD' &&
            'body' in request &&
            request.body
              ? JSON.stringify(request.body)
              : undefined,
        });

        const betterAuthResponse =
          await this.betterAuthService.handleRequest(webRequest);

        if (betterAuthResponse) {
          // Set headers from Better Auth response
          if (betterAuthResponse.headers) {
            betterAuthResponse.headers.forEach((value: string, key: string) => {
              if ('setHeader' in response) {
                // Express case
                response.setHeader(key, value);
              } else {
                // Fastify case
                response.header(key, value);
              }
            });
          }

          // Set status code and send response
          if ('status' in response) {
            // Express case
            const expressResponse = response as Response;
            if (betterAuthResponse.status) {
              expressResponse.status(betterAuthResponse.status);
            }
            if (betterAuthResponse.body) {
              const body = await betterAuthResponse.text();
              expressResponse.send(body);
            } else {
              expressResponse.end();
            }
          } else {
            // Fastify case
            const fastifyResponse = response as FastifyReply;
            if (betterAuthResponse.status) {
              fastifyResponse.code(betterAuthResponse.status);
            }
            if (betterAuthResponse.body) {
              const body = await betterAuthResponse.text();
              fastifyResponse.send(body);
            } else {
              fastifyResponse.send();
            }
          }

          // Return false to prevent further processing
          return false;
        }
      } catch (error) {
        console.error('[BetterAuthGuard] Authentication error:', error);

        if (!options.disableExceptionFilter) {
          throw error;
        }

        // Return 500 error
        if ('status' in response) {
          // Express case
          (response as Response).status(500).send('Internal Server Error');
        } else {
          // Fastify case
          (response as FastifyReply).code(500).send('Internal Server Error');
        }

        return false;
      }
    }

    // Allow other routes to continue
    return true;
  }
}
