import { Module } from '@nestjs/common';
import { AppExpressController } from './app.controller';
import { AppExpressService } from './app.service';

@Module({
  imports: [],
  controllers: [AppExpressController],
  providers: [AppExpressService],
})
export class AppExpressModule {}
