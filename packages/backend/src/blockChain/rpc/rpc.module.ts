import { Module } from '@nestjs/common';
import { HardhatRpcService } from './rpc.hardhat.service';
import { SepoliaRpcService } from './rpc.sepolia.service';
import { MumbaiRpcService } from './rpc.mumbai.service';

@Module({
  providers: [
    {
      provide: 'HardhatRpcService',
      useClass: HardhatRpcService,
    },
    {
      provide: 'SepoliaRpcService',
      useClass: SepoliaRpcService,
    },
    {
      provide: 'MumbaiRpcService',
      useClass: MumbaiRpcService,
    },
  ],
  exports: [HardhatRpcService, SepoliaRpcService, MumbaiRpcService],
})
export class RpcModule {}
