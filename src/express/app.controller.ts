import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired } from '../../libs/better-auth/src';
import { AppExpressService } from './app.service';

@ApiTags('App Express')
@Controller()
export class AppExpressController {
  constructor(private readonly appService: AppExpressService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/auth')
  @AuthRequired()
  testAuth(): string {
    return 'Authenticated successfully!';
  }
}
