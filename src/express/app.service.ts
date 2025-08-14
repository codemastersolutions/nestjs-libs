import { Injectable } from '@nestjs/common';

@Injectable()
export class AppExpressService {
  getHello(): string {
    return 'Hello World from Express!';
  }
}
