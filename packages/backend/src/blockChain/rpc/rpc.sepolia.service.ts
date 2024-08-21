import {
  Inject,
  Injectable,
  LoggerService,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type RpcService } from './interfaces/rpc.interface';
import { ContractService } from '../contract/contract.service';
import { FsService } from '../utils/fs.service';
import { type ContractConfig } from '../contract/interfaces/contract.interface';
import {
  type ContractType,
  type TokenContractType,
  type PairContractType,
} from './types/types';
import { ethers, JsonRpcProvider, Interface, type Contract } from 'ethers';
import { setTimeout } from 'timers/promises';

@Injectable()
export class SepoliaRpcService implements RpcService, OnModuleInit {
  private initPromise!: Promise<void>;

  private isConnected: boolean;

  private readonly https: string;
  private readonly wss: string;
  private readonly provider: JsonRpcProvider;

  // map
  private readonly interfaceByAddressMap: Map<string, Interface>;
  private readonly contractByAddressMap: Map<string, Contract>;
  private readonly contractNameMap: Map<string, string>;
  private readonly contractAddressMap: Map<string, string>;
  private readonly contractEventListByAddressMap: Map<string, string[]>;
  // array
  private readonly currentDeployedContractList: ContractType[];
  private readonly tokenContractList: TokenContractType[];
  private readonly pairContractList: PairContractType[];

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly contractService: ContractService,
    private readonly fsService: FsService,
  ) {
    this.interfaceByAddressMap = new Map<string, Interface>();
    this.contractByAddressMap = new Map<string, Contract>();
    this.contractNameMap = new Map<string, string>();
    this.contractAddressMap = new Map<string, string>();
    this.contractEventListByAddressMap = new Map<string, string[]>();
    this.currentDeployedContractList = [];
    this.tokenContractList = [];
    this.pairContractList = [];

    const https = this.configService.get<string>(
      'endpoints.ethereum.sepolia.url.https',
    );
    if (https === undefined) {
      throw new Error('config error');
    }
    this.https = https;

    const wss = this.configService.get<string>(
      'endpoints.ethereum.sepolia.url.wss',
    );
    if (wss === undefined) {
      throw new Error('config error');
    }
    this.wss = wss;

    this.provider = new JsonRpcProvider(this.https);
    this.isConnected = false;
  }

  async getInitializationPromise(): Promise<void> {
    await this.initPromise;
  }

  getRpc(): string {
    return this.https;
  }

  getProvider(): JsonRpcProvider {
    return new JsonRpcProvider(this.getRpc());
  }

  // contract
  getContractInterfaceByName(name: string): Interface | undefined {
    return this.contractService.getContractInterfaceByName(name);
  }

  getContractInterfaceByAddress(address: string): Interface | undefined {
    return this.interfaceByAddressMap.get(address);
  }

  getContractName(address: string): string | undefined {
    return this.contractNameMap.get(address);
  }

  getContractAddress(name: string): string | undefined {
    return this.contractAddressMap.get(name);
  }

  getContractByName(name: string): Contract | undefined {
    return this.contractService.getContractByName(name);
  }

  getContractByAddress(address: string): Contract | undefined {
    return this.contractByAddressMap.get(address);
  }

  getContractList(): string[] {
    return this.contractService.getContractList();
  }

  getCurrentDeployedContractList(): ContractType[] {
    return this.currentDeployedContractList;
  }

  getTokenContractList(): TokenContractType[] | null {
    if (this.tokenContractList.length === 0) {
      return null;
    }
    return this.tokenContractList;
  }

  getPairContractList(): PairContractType[] | null {
    if (this.pairContractList.length === 0) {
      return null;
    }
    return this.pairContractList;
  }

  getContractEventList(name?: string, address?: string): string[] | undefined {
    if (name === undefined && address === undefined) {
      throw new Error('param must exist least one');
    }
    if (name !== undefined) {
      return this.contractService.getContractEventList(name);
    }
    if (address !== undefined) {
      return this.contractEventListByAddressMap.get(address);
    }
  }

  getFunctionSignatureByAddress(address: string, functionName: string): string {
    try {
      const interface2 = this.interfaceByAddressMap.get(address);
      if (interface2 === undefined) {
        throw new Error('address is not matched in interface mapping data');
      }
      const function2 = interface2.getFunction(functionName);
      if (function2 === null) {
        throw new Error('function is not existed');
      }
      return function2.selector;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async initConnectNetwork(): Promise<void> {
    try {
      await this.connectNetwork();
    } catch (err) {
      await setTimeout(3000);
      await this.initConnectNetwork();
    }
  }

  async connectNetwork(): Promise<void> {
    try {
      const provider = this.getProvider();
      const network = await provider.getNetwork();
      this.logger.log(JSON.stringify(network, undefined, 2));
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async reconnectNetwork(): Promise<void> {
    await this.connectNetwork();
  }

  getNetworkStatus(): boolean {
    return this.isConnected;
  }

  changeNetworkStatus(value: boolean): void {
    this.isConnected = value;
  }

  async addContract(): Promise<void> {
    const contractsList = this.configService.get<ContractConfig[]>(
      'network.sepolia.contracts',
    );
    if (contractsList !== undefined) {
      try {
        for (const value of contractsList) {
          if (value.name === 'Token') continue;
          if (value.name === 'Pair') continue;
          if (value.address === null) continue;

          const abi = await this.fsService.getAbi(value.name);
          const interface2 = new Interface(Object.values(abi));
          const contract = new ethers.Contract(
            value.address,
            interface2,
            this.provider,
          );
          this.interfaceByAddressMap.set(value.address, interface2);
          this.contractByAddressMap.set(value.address, contract);
          this.contractNameMap.set(value.address, value.name);
          this.contractAddressMap.set(value.name, value.address);
          this.currentDeployedContractList.push({
            name: value.name,
            address: value.address,
          });

          // token
          if (value.name.includes('token')) {
            const token: TokenContractType = {
              name: value.name,
              address: value.address,
              // deployer:
            };
            this.tokenContractList.push(token);
          }

          if (value.eventList !== undefined) {
            this.contractEventListByAddressMap.set(
              value.address,
              value.eventList,
            );
          }
        }
      } catch (err) {
        this.logger.error(err);
        throw err;
      }
    }
  }

  addNewContract = (name: string, address: string): void => {
    try {
      const checkContract = this.getContractByName(name);
      if (checkContract === undefined) {
        throw new Error(`${name} contract is not existed`);
      }
      const interface2 = this.getContractInterfaceByName(name);
      if (interface2 === undefined) {
        throw new Error(`${name} contract is not existed`);
      }

      // pair
      if (name.includes('Pair')) {
        const pair: PairContractType = {
          name,
          address,
        };
        this.pairContractList.push(pair);
      }

      const contract = new ethers.Contract(address, interface2, this.provider);
      this.interfaceByAddressMap.set(address, interface2);
      this.contractByAddressMap.set(address, contract);
      this.contractNameMap.set(address, name);
      this.contractAddressMap.set(name, address);
      this.currentDeployedContractList.push({
        name,
        address,
      });

      const eventList = this.getContractEventList(name, undefined);
      if (eventList !== undefined) {
        this.contractEventListByAddressMap.set(address, eventList);
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  };

  async initializeAsync(): Promise<void> {
    await this.contractService.getInitializationPromise();
    if (process.env['sepolia'] !== '0') {
      await this.initConnectNetwork();
      this.changeNetworkStatus(true);
    }
    await this.addContract();
  }

  async onModuleInit(): Promise<void> {
    this.initPromise = this.initializeAsync();
  }
}
