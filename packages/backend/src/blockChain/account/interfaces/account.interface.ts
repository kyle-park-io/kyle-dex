import { type Wallet } from 'ethers';

export interface AccountService {
  getAddressByName(name: string): string | undefined;

  getWalletByName(name: string): Wallet | undefined;

  getWalletByAddress(address: string): Wallet | undefined;

  getPublicKey(address: string): string;

  getAccount(address: string): Promise<AccountInfo>;

  getAccountList(): any;
}

export interface AccountConfig {
  name: string;
  privateKey: string;
}

export interface AccountInfo {
  network: string;
  name?: string;
  address: string;
  balance: string;
  nonce: string;
}

export interface AccountAddress {
  name: string;
  address: string;
}
