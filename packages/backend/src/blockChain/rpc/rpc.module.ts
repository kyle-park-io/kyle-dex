import { Module } from '@nestjs/common';
import { ContractModule } from '../contract/contract.module';
import { HardhatRpcService } from './rpc.hardhat.service';
import { SepoliaRpcService } from './rpc.sepolia.service';
import { AmoyRpcService } from './rpc.amoy.service';

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
      provide: 'AmoyRpc',
      useClass: AmoyRpcService,
    },
  ],
  exports: ['HardhatRpc', 'SepoliaRpc', 'AmoyRpc'],
})
export class RpcModule {}
