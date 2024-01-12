import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MetaMaskSDK } from '@metamask/sdk';

@Injectable()
export class MetamaskService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const https = this.configService.get<string>(
      'endpoints.ethereum.sepolia.url.https',
    );
    if (https === undefined) {
      throw new Error('config error');
    }

    const MMSDK = new MetaMaskSDK({
      infuraAPIKey: https,
      dappMetadata: {
        name: 'Kyle Dex App',
        url: 'http://localhost:3000',
      },
    });
    // console.log(MMSDK);
  }
}
