import { All, Controller, Req, Res } from '@nestjs/common';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';

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
        if (value !== undefined) {
          const headerValue = Array.isArray(value) ? value[0] : value;
          if (headerValue) {
            headers.set(key, headerValue);
          }
        }
      });

      // Create a standard Request object
      const webRequest = new Request(url.toString(), {
        method: request.method,
        headers,
        body:
          request.method !== 'GET' && request.method !== 'HEAD'
            ? JSON.stringify(request.body)
            : undefined,
      });

      // Handle the request using Better Auth
      const response = await this.betterAuthService.handleRequest(webRequest);

      // Set response headers
      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      // Set status and send response
      const responseText = await response.text();
      return reply.status(response.status).send(responseText);
    } catch (error) {
      console.error('Auth processing error:', error);
      return reply.status(500).send({
        error: 'Internal server error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  /**
   * Health check endpoint for auth service
   */
  @All('api/auth/health')
  healthCheck() {
    try {
      const auth = this.betterAuthService.getAuth();
      return {
        status: 'ok',
        service: 'better-auth',
        timestamp: new Date().toISOString(),
        hasAuth: !!auth,
      };
    } catch (error) {
      return {
        status: 'error',
        service: 'better-auth',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
