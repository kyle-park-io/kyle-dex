import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  type AccountInfo,
  type AccountService,
} from './interfaces/account.interface';
import { RpcService } from '../rpc/interfaces/rpc.interface';
import { ConfigService } from '@nestjs/config';
import { ethers, type JsonRpcProvider, type Wallet } from 'ethers';
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

  getAddressByName(name: string): undefined {}

  getWalletByName(name: string): Wallet | undefined {
    return this.walletMap.get(name);
  }

  getWalletByAddress(address: string): Wallet | undefined {
    return this.walletMap.get(address);
  }

  getPublicKey(address: string): string {
    return '0x';
  }

  async getAccount(address: string): Promise<AccountInfo> {
    const provider: JsonRpcProvider = this.rpcService.getProvider();

    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    const nonce = await provider.getTransactionCount(address);

    const account: AccountInfo = {
      network: network.name,
      address,
      balance: balance.toString(),
      nonce: nonce.toString(),
    };
    return account;
  }

  getAccountList(): void {}

  createWallet(name: string, address: string): void {}
}
