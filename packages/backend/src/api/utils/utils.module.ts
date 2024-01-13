import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { HardhatRpcService } from '../../blockChain/rpc/rpc.hardhat.service';
import { HardhatAccountService } from '../../blockChain/account/account.hardhat.service';

@Module({
  controllers: [UtilsController],
  providers: [
    { provide: 'HardhatRpc', useClass: HardhatRpcService },
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
    UtilsService,
  ],
  exports: [UtilsService],
})
export class UtilsModule {}
