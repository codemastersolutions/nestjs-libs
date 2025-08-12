import { Module } from '@nestjs/common';
import { AppFastifyController } from './app.controller';
import { AppFastifyService } from './app.service';

@Module({
  imports: [],
  controllers: [AppFastifyController],
  providers: [AppFastifyService],
})
export class AppModule {}
