import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppFastifyService } from './app.service';

@ApiTags('App Fastify')
@Controller()
export class AppFastifyController {
  constructor(private readonly appService: AppFastifyService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
