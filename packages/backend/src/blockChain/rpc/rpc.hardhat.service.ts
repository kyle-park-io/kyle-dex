import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type RpcService } from './interfaces/rpc.interface';
import { JsonRpcProvider } from 'ethers';
import { setTimeout } from 'timers/promises';

@Injectable()
export class HardhatRpcService implements RpcService {
  private readonly http: string;
  private readonly ws: string;
  private readonly provider: JsonRpcProvider;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    const http = this.configService.get<string>(
      'endpoints.localhost.hardhat.url.http',
    );
    if (http === undefined) {
      throw new Error('config error');
    }
    this.http = http;

    const ws = this.configService.get<string>(
      'endpoints.localhost.hardhat.url.ws',
    );
    if (ws === undefined) {
      throw new Error('config error');
    }
    this.ws = ws;

    this.provider = new JsonRpcProvider(this.http);
  }

  getRpc(): string {
    return this.http;
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
