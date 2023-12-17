import { type Wallet } from 'ethers';

export interface AccountService {
  getWallet(address: string): Wallet | undefined;

  getPublicKey(address: string): string;
}
