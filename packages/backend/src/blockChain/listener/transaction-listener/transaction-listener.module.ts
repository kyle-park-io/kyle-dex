import { Module } from '@nestjs/common';
import { TransactionListenerService } from './transaction-listener.service';
import { HardhatRpcService } from '../../rpc/rpc.hardhat.service';
import { SepoliaRpcService } from '../../rpc/rpc.sepolia.service';
import { MumbaiRpcService } from '../../rpc/rpc.mumbai.service';

@Module({
  providers: [
    { provide: 'HardhatRpc', useClass: HardhatRpcService },
    { provide: 'SepoliaRpc', useClass: SepoliaRpcService },
    { provide: 'MumbaiRpc', useClass: MumbaiRpcService },
    TransactionListenerService,
  ],
})
export class TransactionListenerModule {}
