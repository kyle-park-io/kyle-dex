import { Module } from '@nestjs/common';
import { SepoliaRpcService } from './rpc.sepolia.service';
import { HardhatRpcService } from './rpc.hardhat.service';

@Module({
  providers: [
    {
      provide: 'SepoliaRpcService',
      useClass:
        process.env.NODE_ENV === 'development'
          ? SepoliaRpcService
          : HardhatRpcService,
    },
    {
      provide: 'GanacheRpcService',
      useClass: HardhatRpcService,
    },
  ],
  exports: [SepoliaRpcService, HardhatRpcService],
})
export class RpcModule {}
