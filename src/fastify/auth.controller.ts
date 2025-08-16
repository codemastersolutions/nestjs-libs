import { All, Controller, Req, Res } from '@nestjs/common';
import { BetterAuthService } from '../../libs/better-auth/src/better-auth.service';

// Interface for Fastify request/response objects
interface FastifyRequest {
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
}

interface FastifyReply {
  header(key: string, value: string): FastifyReply;
  status(code: number): FastifyReply;
  send(payload?: any): FastifyReply;
}

@Controller()
export class AuthController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  @All('api/auth')
  async handleAuthBase(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    return this.processAuth(request, reply);
  }

  @All('api/auth/*')
  async handleAuth(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    return this.processAuth(request, reply);
  }

  private async processAuth(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    try {
      // Construct request URL
      const host = Array.isArray(request.headers.host)
        ? request.headers.host[0]
        : request.headers.host || 'localhost:3901';
      const protocol = Array.isArray(request.headers['x-forwarded-proto'])
        ? request.headers['x-forwarded-proto'][0]
        : request.headers['x-forwarded-proto'] || 'http';
      const url = new URL(request.url, `${protocol}://${host}`);

      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          const headerValue = Array.isArray(value)
            ? value.join(', ')
            : String(value);
          headers.append(key, headerValue);
        }
      });

      // Create Fetch API-compatible request
      const webRequest = new Request(url.toString(), {
        method: request.method,
        headers,
        body:
          request.method !== 'GET' && request.method !== 'HEAD' && request.body
            ? JSON.stringify(request.body)
            : undefined,
      });

      // Process authentication request
      const response = await this.betterAuthService.handleRequest(webRequest);

      if (response) {
        // Set headers from Better Auth response
        if (response.headers) {
          response.headers.forEach((value: string, key: string) => {
            reply.header(key, value);
          });
        }

        // Set status code
        if (response.status) {
          reply.status(response.status);
        }

        // Send response body
        if (response.body) {
          const body = await response.text();
          return reply.send(body);
        } else {
          return reply.send();
        }
      }

      return reply.status(404).send({ error: 'Not found' });
    } catch (error: any) {
      console.error('Authentication Error:', error);
      return reply.status(500).send({
        error: 'Internal authentication error',
        code: 'AUTH_FAILURE',
      });
    }
  }
}
