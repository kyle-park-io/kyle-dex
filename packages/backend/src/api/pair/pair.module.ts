import { Module } from '@nestjs/common';
import { PairService } from './pair.service';
import { PairController } from './pair.controller';

@Module({
  controllers: [PairController],
  providers: [PairService],
})
export class PairModule {}
