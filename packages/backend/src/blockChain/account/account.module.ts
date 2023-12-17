import { Module } from '@nestjs/common';
import { SepoliaAccountService } from './account.service';
import { RpcServiceFactory } from '../rpc/rpc.factory';

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
      useFactory: () => RpcServiceFactory.createService(true),
    },
    SepoliaAccountService,
  ],
  exports: ['CONFIG', 'RpcService', SepoliaAccountService],
})
export class AccountModule {}
