import { Injectable } from '@nestjs/common';

@Injectable()
export class AppFastifyService {
  getHello(): string {
    return 'Hello World from Fastify!';
  }
}
