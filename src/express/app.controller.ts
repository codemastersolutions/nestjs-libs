import { Controller, Get } from '@nestjs/common';
import { AppExpressService } from './app.service';

@Controller('express')
export class AppExpressController {
  constructor(private readonly appService: AppExpressService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
