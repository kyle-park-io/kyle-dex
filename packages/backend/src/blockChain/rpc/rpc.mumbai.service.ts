import {
  Inject,
  Injectable,
  LoggerService,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type RpcService } from './interfaces/rpc.interface';
import { JsonRpcProvider } from 'ethers';
import { setTimeout } from 'timers/promises';

@Injectable()
export class MumbaiRpcService implements RpcService, OnModuleInit {
  private readonly https: string;
  private readonly wss: string;
  private readonly provider: JsonRpcProvider;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    const https = this.configService.get<string>(
      'endpoints.polygon.mumbai.url.https',
    );
    if (https === undefined) {
      throw new Error('config error');
    }
    this.https = https;

    const wss = this.configService.get<string>(
      'endpoints.polygon.mumbai.url.wss',
    );
    if (wss === undefined) {
      throw new Error('config error');
    }
    this.wss = wss;

    this.provider = new JsonRpcProvider(this.https);
  }

  getRpc(): string {
    return this.https;
  }

  getProvider(): JsonRpcProvider {
    return new JsonRpcProvider(this.getRpc());
  }

  async connectNetwork(): Promise<void> {
    try {
      const provider = this.getProvider();
      const network = await provider.getNetwork();
      this.logger.log(JSON.stringify(network, undefined, 2));
    } catch (err) {
      this.logger.error(err);
      await setTimeout(3000);
      await this.connectNetwork();
    }
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.connectNetwork();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
