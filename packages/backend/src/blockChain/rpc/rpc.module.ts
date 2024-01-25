import { Module } from '@nestjs/common';
import { ContractModule } from '../contract/contract.module';
import { HardhatRpcService } from './rpc.hardhat.service';
import { SepoliaRpcService } from './rpc.sepolia.service';
import { MumbaiRpcService } from './rpc.mumbai.service';

@Module({
  imports: [ContractModule],
  providers: [
    {
      provide: 'HardhatRpc',
      useClass: HardhatRpcService,
    },
    {
      provide: 'SepoliaRpc',
      useClass: SepoliaRpcService,
    },
    {
      provide: 'MumbaiRpc',
      useClass: MumbaiRpcService,
    },
  ],
  exports: ['HardhatRpc', 'SepoliaRpc', 'MumbaiRpc'],
})
export class RpcModule {}
