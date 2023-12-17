import { Module } from '@nestjs/common';
import { FsService } from './fs.service';
import { DecodeService } from './decode.service';

@Module({
  providers: [FsService, DecodeService],
  exports: [FsService, DecodeService],
})
export class UtilsModule {}
