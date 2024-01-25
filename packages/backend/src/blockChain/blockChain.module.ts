import { Global, Module } from '@nestjs/common';
import { RpcModule } from './rpc/rpc.module';
import { AccountModule } from './account/account.module';
import { CommonModule } from './common/common.module';

@Global()
@Module({
  imports: [RpcModule, AccountModule, CommonModule],
  exports: [RpcModule, AccountModule, CommonModule],
})
export class BlockChainModule {}
