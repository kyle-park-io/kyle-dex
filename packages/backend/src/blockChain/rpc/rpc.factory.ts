import { type ConfigService } from '@nestjs/config';
import { type LoggerService } from '@nestjs/common';
import { type RpcService } from './interfaces/rpc.interface';
import { SepoliaRpcService } from './rpc.sepolia.service';
import { HardhatRpcService } from './rpc.hardhat.service';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RpcServiceFactory {
  static createService(
    someCondition: boolean,
    configService: ConfigService,
    loggerService: LoggerService,
  ): void {
    // RpcService;
    // if (someCondition) {
    //   return new SepoliaRpcService(configService, loggerService);
    // } else {
    //   return new HardhatRpcService(configService, loggerService);
    // }
  }
}
