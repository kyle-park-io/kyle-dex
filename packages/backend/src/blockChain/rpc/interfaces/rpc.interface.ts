import { type Contract } from 'ethers';

export interface RpcService {
  getInitializationPromise(): Promise<void>;

  getRpc(): string;

  getProvider(): any;

  connectNetwork(): Promise<void>;

  addContract(): Promise<void>;

  // contract
  getContractName(address: string): string | undefined;

  getContractAddress(name: string): string | undefined;

  getContractByName(name: string): Contract | undefined;

  getContractByAddress(address: string): Contract | undefined;

  getContractList(): string[];

  getContractEventList(name?: string, address?: string): string[] | undefined;

  getFunctionSignatureByAddress(address: string, functionName: string): string;

  // getRule(): any;
}
