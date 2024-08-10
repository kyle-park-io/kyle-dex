import { Global, Module } from '@nestjs/common';
import { RpcModule } from './rpc/rpc.module';
import { AccountModule } from './account/account.module';
import { CommonModule } from './common/common.module';
import { ListenerModule } from './listener/listener.module';

@Global()
@Module({
  imports: [RpcModule, AccountModule, CommonModule, ListenerModule],
  exports: [RpcModule, AccountModule, CommonModule, ListenerModule],
})
export class BlockChainModule {}
