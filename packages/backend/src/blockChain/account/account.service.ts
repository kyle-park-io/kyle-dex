import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { type AccountService } from './interfaces/account.interface';
import { RpcService } from '../rpc/interfaces/rpc.interface';
import { ConfigService } from '@nestjs/config';
import { ethers, type Wallet } from 'ethers';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SepoliaAccountService implements AccountService {
  // map
  private readonly walletMap: Map<string, Wallet>;

  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // extra
    @Inject('CONFIG') private readonly config,
    @Inject('RpcService') private readonly rpcService: RpcService,
  ) {
    this.logger.log(this.config.kyle);

    this.walletMap = new Map<string, Wallet>();
    const privateKey = this.configService.get<string>('account.privateKey');
    if (privateKey !== undefined) {
      try {
        const wallet = new ethers.Wallet(
          privateKey,
          this.rpcService.getProvider(),
        );
        this.walletMap.set(wallet.address, wallet);
      } catch (err) {
        this.logger.error(err);
        throw err;
      }
    }
  }

  getWallet(address: string): Wallet | undefined {
    return this.walletMap.get(address);
  }

  getPublicKey(address: string): string {
    return '0x';
  }

  createWallet(privateKey: string): void {
    try {
      const wallet = new ethers.Wallet(
        privateKey,
        this.rpcService.getProvider(),
      );
      if (this.getWallet(wallet.address) !== undefined) {
        throw new Error('already existed wallet');
      }
      this.walletMap.set(wallet.address, wallet);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
