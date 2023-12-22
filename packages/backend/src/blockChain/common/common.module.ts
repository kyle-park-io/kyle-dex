import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { AccountModule } from '../account/account.module';
import { ContractModule } from '../contract/contract.module';
import { UtilsModule } from '../utils/utils.module';

@Global()
@Module({
  imports: [AccountModule, ContractModule, UtilsModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
