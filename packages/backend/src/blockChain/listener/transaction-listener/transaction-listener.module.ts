import { Module } from '@nestjs/common';
import { HardhatTransactionListenerService } from './transaction-listener.hardhat.service';
import { RpcModule } from '../../../blockChain/rpc/rpc.module';

@Module({
  imports: [RpcModule],
  providers: [
    {
      provide: 'HardhatTransaction',
      useClass: HardhatTransactionListenerService,
    },
  ],
})
export class TransactionListenerModule {}
