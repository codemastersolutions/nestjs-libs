import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppExpressService } from './app.service';

@ApiTags('App Express')
@Controller()
export class AppExpressController {
  constructor(private readonly appService: AppExpressService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
