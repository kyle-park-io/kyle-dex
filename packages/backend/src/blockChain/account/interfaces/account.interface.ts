import { type Wallet } from 'ethers';

export interface AccountService {
  getWalletByName(name: string): Wallet | undefined;

  getWalletByAddress(address: string): Wallet | undefined;

  getPublicKey(address: string): string;
}

export interface AccountConfig {
  name: string;
  privateKey: string;
}
