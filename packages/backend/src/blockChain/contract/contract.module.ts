import { Global, Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { UtilsModule } from '../utils/utils.module';

@Global()
@Module({
  imports: [UtilsModule],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
