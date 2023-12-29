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
    @Inject('SepoliaRpc') private readonly rpcService: RpcService,
  ) {
    this.walletMap = new Map<string, Wallet>();
  }

  getWalletByName(name: string): Wallet | undefined {
    return this.walletMap.get(name);
  }

  getWalletByAddress(address: string): Wallet | undefined {
    return this.walletMap.get(address);
  }

  getPublicKey(address: string): string {
    return '0x';
  }

  createWallet(name: string, address: string): void {}
}
