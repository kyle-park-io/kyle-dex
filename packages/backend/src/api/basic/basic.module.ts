import { Module } from '@nestjs/common';
import { BasicService } from './basic.service';
import { BasicController } from './basic.controller';

@Module({
  controllers: [BasicController],
  providers: [BasicService],
})
export class BasicModule {}
