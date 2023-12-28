import { Module, Global } from '@nestjs/common';
import { FsService } from './fs.service';
import { DecodeService } from './decode.service';

@Global()
@Module({
  providers: [FsService, DecodeService],
  exports: [FsService, DecodeService],
})
export class UtilsModule {}
