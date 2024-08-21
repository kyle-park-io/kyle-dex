import { Module } from '@nestjs/common';
import { PairController } from './pair.controller';
import { HardhatPairService } from './pair.hardhat.service';
import { SepoliaPairService } from './pair.sepolia.service';
import { AmoyPairService } from './pair.amoy.service';

@Module({
  controllers: [PairController],
  providers: [HardhatPairService, SepoliaPairService, AmoyPairService],
})
export class PairModule {}
