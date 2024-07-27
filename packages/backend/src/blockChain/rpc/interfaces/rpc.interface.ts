import { type JsonRpcProvider, type Interface, type Contract } from 'ethers';

export interface RpcService {
  getInitializationPromise(): Promise<void>;

  getRpc(): string;

  getProvider(): JsonRpcProvider;

  initConnectNetwork(): Promise<void>;

  connectNetwork(): Promise<void>;

  reconnectNetwork(): Promise<void>;

  getNetworkStatus(): boolean;

  changeNetworkStatus(value: boolean): void;

  addContract(): Promise<void>;

  // contract
  getContractInterfaceByName(name: string): Interface | undefined;

  getContractInterfaceByAddress(address: string): Interface | undefined;

  getContractName(address: string): string | undefined;

  getContractAddress(name: string): string | undefined;

  getContractByName(name: string): Contract | undefined;

  getContractByAddress(address: string): Contract | undefined;

  getContractList(): string[];

  getTokenContractList(): Contract[];

  getContractEventList(name?: string, address?: string): string[] | undefined;

  getFunctionSignatureByAddress(address: string, functionName: string): string;

  // getRule(): any;

  setContract(name: string, address: string): void;
}
