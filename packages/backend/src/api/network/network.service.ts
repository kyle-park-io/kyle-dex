import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RpcService } from '../../blockChain/rpc/interfaces/rpc.interface';
// dto
import { NetworkType } from './dto/network.request';
import { type JsonRpcProvider } from 'ethers';

@Injectable()
export class NetworkService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // rpc
    @Inject('HardhatRpc')
    private readonly hardhatRpcService: RpcService,
    @Inject('SepoliaRpc')
    private readonly sepoliaRpcService: RpcService,
    @Inject('AmoyRpc')
    private readonly amoyRpcService: RpcService,
  ) {}

  getNetwork(network: NetworkType): JsonRpcProvider {
    try {
      switch (network) {
        case NetworkType.hardhat:
          return this.hardhatRpcService.getProvider();
        case NetworkType.sepolia:
          return this.sepoliaRpcService.getProvider();
        case NetworkType.amoy:
          return this.amoyRpcService.getProvider();
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async reconnectNetwork(network: NetworkType): Promise<string> {
    try {
      switch (network) {
        case NetworkType.hardhat:
          await this.hardhatRpcService.reconnectNetwork();
          break;
        case NetworkType.sepolia:
          await this.sepoliaRpcService.reconnectNetwork();
          break;
        case NetworkType.amoy:
          await this.amoyRpcService.reconnectNetwork();
          break;
        default:
          return 'wrong network';
      }
      return 'true';
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
