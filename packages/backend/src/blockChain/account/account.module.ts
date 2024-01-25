/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module, type LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HardhatAccountService } from './account.hardhat.service';
import { SepoliaAccountService } from './account.sepolia.service';
import { MumbaiAccountService } from './account.mumbai.service';
import { RpcServiceFactory } from '../rpc/rpc.factory';
import { HardhatRpcService } from '../rpc/rpc.hardhat.service';
import { SepoliaRpcService } from '../rpc/rpc.sepolia.service';
import { MumbaiRpcService } from '../rpc/rpc.mumbai.service';
import { RpcModule } from '../rpc/rpc.module';

@Module({
  imports: [RpcModule],
  providers: [
    {
      provide: 'CONFIG',
      useValue: {
        kyle: 'Zzang',
      },
    },
    // {
    //   provide: 'RpcService',
    //   useFactory: (
    //     configService: ConfigService,
    //     loggerService: LoggerService,
    //   ) => {
    //     return RpcServiceFactory.createService(
    //       false,
    //       configService,
    //       loggerService,
    //     );
    //   },
    // inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    // },
    // { provide: 'HardhatRpc', useClass: HardhatRpcService },
    // { provide: 'SepoliaRpc', useClass: SepoliaRpcService },
    // { provide: 'MumbaiRpc', useClass: MumbaiRpcService },
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
    { provide: 'SepoliaAccount', useClass: SepoliaAccountService },
    { provide: 'MumbaiAccount', useClass: MumbaiAccountService },
  ],
  exports: ['CONFIG', 'HardhatAccount', 'SepoliaAccount', 'MumbaiAccount'],
})
export class AccountModule {}
