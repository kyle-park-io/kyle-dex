import { Global, Module } from '@nestjs/common';
import { HardhatAccountService } from './account.hardhat.service';
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
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
  ],
  exports: ['CONFIG', 'RpcService', 'HardhatAccount'],
})
export class AccountModule {}
