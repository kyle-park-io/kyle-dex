import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
