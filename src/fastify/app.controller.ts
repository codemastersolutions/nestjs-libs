import { Controller, Get } from '@nestjs/common';
import { AppFastifyService } from './app.service';

@Controller('fastify')
export class AppFastifyController {
  constructor(private readonly appService: AppFastifyService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
