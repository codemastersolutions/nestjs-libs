import { AuthRequired } from '../../libs/better-auth/src';
import { Controller, Get, Post } from '@nestjs/common';
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

  @Post('test/auth')
  @AuthRequired()
  testAuth() {
    return {
      message: 'Hello, world!',
    };
  }
}
