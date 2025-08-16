import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { BetterAuthService } from './better-auth.service';

// Interface for handling both Express and Fastify request objects
interface UniversalRequest {
  path?: string;
  url?: string;
  method?: string;
  headers?: Record<string, string | string[]>;
  protocol?: string;
  originalUrl?: string;
  body?: any;
  get?: (header: string) => string | undefined;
}

@Injectable()
export class BetterAuthMiddleware implements NestMiddleware {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  async use(req: UniversalRequest, res: Response, next: NextFunction) {
    const options = this.betterAuthService.getOptions();
    const authPath = options.globalPrefix
      ? `/${options.globalPrefix}/api/auth`
      : '/api/auth';

    // Handle both Express and Fastify request objects
    // In Fastify with middie, we get the raw IncomingMessage object
    // Express provides req.path, Fastify middleware gets req.url on the raw object
    let requestPath = '';

    if (req.path) {
      // Express case
      requestPath = req.path;
    } else if (req.url) {
      // Fastify case - req is the raw IncomingMessage
      // Parse URL to get just the pathname
      try {
        const host = Array.isArray(req.headers?.host)
          ? req.headers.host[0]
          : req.headers?.host || 'localhost';
        const url = new URL(req.url, `http://${host}`);
        requestPath = url.pathname;
      } catch {
        requestPath = req.url.split('?')[0]; // Fallback: split by query params
      }
    }

    // Debug: Log request properties
    const pathStr = req.path || 'undefined';
    const urlStr = req.url || 'undefined';
    console.log(
      `[BetterAuthMiddleware] Debug - req.path: ${pathStr}, req.url: ${urlStr}, extracted path: ${requestPath}`,
    );
    console.log(
      `[BetterAuthMiddleware] Request path: ${requestPath}, Auth path: ${authPath}`,
    );

    if (requestPath.startsWith(authPath)) {
      console.log(
        `[BetterAuthMiddleware] Handling auth request: ${requestPath}`,
      );
      try {
        // Create a Web API compatible request object
        const protocol = req.protocol || 'http';
        const hostHeader = req.get
          ? req.get('host')
          : Array.isArray(req.headers?.host)
            ? req.headers.host[0]
            : req.headers?.host;
        const host = hostHeader || 'localhost';
        const originalUrl = req.originalUrl || req.url || '';
        const method = req.method || 'GET';

        const webRequest = new Request(`${protocol}://${host}${originalUrl}`, {
          method,
          headers: new Headers(req.headers as Record<string, string>),
          body:
            method !== 'GET' && method !== 'HEAD'
              ? JSON.stringify(req.body)
              : undefined,
        });

        const response = await this.betterAuthService.handleRequest(webRequest);

        if (response) {
          // Set headers from Better Auth response
          if (response.headers) {
            response.headers.forEach((value: string, key: string) => {
              res.setHeader(key, value);
            });
          }

          // Set status code
          if (response.status) {
            res.status(response.status);
          }

          // Send response body
          if (response.body) {
            const body = await response.text();
            res.send(body);
          } else {
            res.end();
          }
        }
        return;
      } catch (error) {
        if (!options.disableExceptionFilter) {
          throw error;
        }
      }
    }

    next();
  }
}
