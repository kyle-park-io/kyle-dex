import { Module } from '@nestjs/common';
import { MetamaskService } from './metamask.service';

@Module({
  providers: [MetamaskService],
})
export class MetamaskModule {}
