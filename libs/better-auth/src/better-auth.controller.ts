import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Options,
  Head,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BetterAuthService } from './better-auth.service';

@Controller('api/auth')
export class BetterAuthController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  @Get(':path')
  @Post(':path')
  @Put(':path')
  @Delete(':path')
  @Patch(':path')
  @Options(':path')
  @Head(':path')
  async handleAuth(
    @Req() request: Request | FastifyRequest,
    @Res() response: Response | FastifyReply,
    @Param() params: Record<string, string>,
  ) {
    try {
      // Type guards for better type safety
      const isExpressRequest = (
        req: Request | FastifyRequest,
      ): req is Request => 'originalUrl' in req && 'protocol' in req;

      const isFastifyRequest = (
        req: Request | FastifyRequest,
      ): req is FastifyRequest => 'url' in req && !('originalUrl' in req);

      const getRequestUrl = (req: Request | FastifyRequest): string => {
        if (isExpressRequest(req)) {
          return req.originalUrl || req.url || '';
        } else if (isFastifyRequest(req)) {
          return req.url || '';
        }
        return '';
      };

      console.log('[BetterAuthController] Request received:', {
        method: request.method,
        url: getRequestUrl(request),
        params,
        headers: request.headers,
      });

      // Create a Web API compatible request object
      const protocol = isExpressRequest(request) ? request.protocol : 'http';
      const host = request.headers.host || 'localhost';
      const originalUrl = getRequestUrl(request);
      const method = request.method || 'GET';

      const fullUrl = `${protocol}://${host}${originalUrl}`;
      console.log('[BetterAuthController] Creating Web Request:', {
        fullUrl,
        method,
        headers: request.headers,
      });

      const webRequest = new Request(fullUrl, {
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
      console.log('[BetterAuthController] Better Auth Response:', {
        status: betterAuthResponse?.status,
        hasBody: !!betterAuthResponse?.body,
        headers: betterAuthResponse?.headers
          ? Array.from(betterAuthResponse.headers.entries())
          : [],
      });

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
        if ('send' in response && 'status' in response) {
          // Express case
          const expressResponse = response as Response;
          if (betterAuthResponse.status) {
            expressResponse.status(betterAuthResponse.status);
          }
          if (betterAuthResponse.body) {
            const body = await betterAuthResponse.text();
            return expressResponse.send(body);
          } else {
            return expressResponse.send('');
          }
        } else {
          // Fastify case
          const fastifyResponse = response as FastifyReply;
          if (betterAuthResponse.status) {
            fastifyResponse.code(betterAuthResponse.status);
          }
          if (betterAuthResponse.body) {
            const body = await betterAuthResponse.text();
            return fastifyResponse.send(body);
          } else {
            return fastifyResponse.send('');
          }
        }
      }

      // If no response from Better Auth, return 404
      if ('send' in response && 'status' in response) {
        return (response as Response).status(404).send('Not Found');
      } else {
        return (response as FastifyReply).code(404).send('Not Found');
      }
    } catch (error) {
      console.error('[BetterAuthController] Authentication error:', error);

      const options = this.betterAuthService.getOptions();
      if (!options.disableExceptionFilter) {
        throw error;
      }

      // Return 500 error
      if ('send' in response && 'status' in response) {
        return (response as Response).status(500).send('Internal Server Error');
      } else {
        return (response as FastifyReply)
          .code(500)
          .send('Internal Server Error');
      }
    }
  }
}
