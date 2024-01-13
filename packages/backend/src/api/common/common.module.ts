import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { HardhatRpcService } from '../../blockChain/rpc/rpc.hardhat.service';
import { HardhatAccountService } from '../../blockChain/account/account.hardhat.service';

@Module({
  controllers: [CommonController],
  providers: [
    { provide: 'HardhatRpc', useClass: HardhatRpcService },
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
    CommonService,
  ],
  exports: [CommonService],
})
export class CommonModule {}
