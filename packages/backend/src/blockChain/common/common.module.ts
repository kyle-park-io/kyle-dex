import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { HardhatRpcService } from '../rpc/rpc.hardhat.service';
import { HardhatAccountService } from '../account/account.hardhat.service';

@Global()
@Module({
  providers: [
    { provide: 'HardhatRpc', useClass: HardhatRpcService },
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
    CommonService,
  ],
  exports: [CommonService],
})
export class CommonModule {}
