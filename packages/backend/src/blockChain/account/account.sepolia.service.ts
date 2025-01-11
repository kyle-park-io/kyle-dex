import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  type AccountService,
  type AccountConfig,
  type AccountInfo,
} from './interfaces/account.interface';
import { RpcService } from '../rpc/interfaces/rpc.interface';
import { ConfigService } from '@nestjs/config';
import { ethers, type JsonRpcProvider, type Wallet } from 'ethers';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SepoliaAccountService implements AccountService {
  // map
  private readonly walletMap: Map<string, Wallet>;
  private readonly nameByAddressMap: Map<string, string>;
  private readonly addressBynameMap: Map<string, string>;

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
    this.nameByAddressMap = new Map<string, string>();
    this.addressBynameMap = new Map<string, string>();

    const accountList = this.configService.get<AccountConfig[]>(
      'accounts.network.sepolia',
    );
    if (accountList !== undefined) {
      for (let i = 0; i < accountList.length; i++) {
        if (accountList[i].privateKey === '') {
          continue;
        }
        try {
          this.createWallet(
            accountList[i].name,
            accountList[i].privateKey,
            accountList[i].address,
          );
        } catch (err) {
          this.logger.error(err);
          throw err;
        }
      }
    }
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
    const wallet: Wallet | undefined = this.walletMap.get(address);
    if (wallet === undefined) {
      throw new Error(`wallet is not existed, address : ${address}`);
    }
    const name = this.nameByAddressMap.get(address);
    if (name === undefined) {
      throw new Error(`wallet is not existed, address : ${address}`);
    }

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

  private createWallet(
    name: string,
    privateKey: string,
    address: string,
  ): void {
    try {
      const wallet = new ethers.Wallet(
        privateKey,
        this.rpcService.getProvider(),
      );
      if (address !== wallet.address) {
        throw new Error('address config is not matched by wallet address');
      }
      if (this.getWalletByAddress(wallet.address) !== undefined) {
        throw new Error('already existed wallet');
      }
      this.walletMap.set(wallet.address, wallet);
      this.walletMap.set(name, wallet);
      this.nameByAddressMap.set(wallet.address, name);
      this.addressBynameMap.set(name, wallet.address);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
