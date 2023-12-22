import { Module, Global } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';

@Global()
@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
