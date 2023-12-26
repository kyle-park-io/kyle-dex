import { Global, Module } from '@nestjs/common';
import { SepoliaAccountService } from './account.service';
import { RpcServiceFactory } from '../rpc/rpc.factory';

@Global()
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: {
        kyle: 'Zzang',
      },
    },
    {
      provide: 'RpcService',
      useFactory: () => RpcServiceFactory.createService(false),
    },
    SepoliaAccountService,
  ],
  exports: ['CONFIG', 'RpcService', SepoliaAccountService],
})
export class AccountModule {}
