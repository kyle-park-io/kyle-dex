import { Module } from '@nestjs/common';
import { SepoliaRpcService } from './rpc.sepolia.service';
import { GanacheRpcService } from './rpc.ganache.service';

@Module({
  providers: [
    {
      provide: 'SepoliaRpcService',
      useClass:
        process.env.NODE_ENV === 'development'
          ? SepoliaRpcService
          : GanacheRpcService,
    },
    {
      provide: 'GanacheRpcService',
      useClass: GanacheRpcService,
    },
  ],
  exports: [SepoliaRpcService, GanacheRpcService],
})
export class RpcModule {}
