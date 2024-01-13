import {
  Inject,
  Injectable,
  LoggerService,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FsService } from '../utils/fs.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type ContractConfig } from './interfaces/contract.interface';
import { ethers, Interface, ZeroAddress, type Contract } from 'ethers';

@Injectable()
export class ContractService implements OnModuleInit {
  private initPromise!: Promise<void>;

  // map
  private readonly interfaceByNameMap: Map<string, Interface>;
  private readonly contractByNameMap: Map<string, Contract>;
  private readonly contractList: string[];
  private readonly contractEventListByNameMap: Map<string, string[]>;

  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // extra
    private readonly fsService: FsService,
  ) {
    this.interfaceByNameMap = new Map<string, Interface>();
    this.contractByNameMap = new Map<string, Contract>();
    this.contractList = [];
    this.contractEventListByNameMap = new Map<string, string[]>();
  }

  async getInitializationPromise(): Promise<void> {
    await this.initPromise;
  }

  getContractByName(name: string): Contract | undefined {
    return this.contractByNameMap.get(name);
  }

  getContractList(): string[] {
    return this.contractList;
  }

  getContractEventList(name: string): string[] | undefined {
    return this.contractEventListByNameMap.get(name);
  }

  getFunctionSignatureByName(name: string, functionName: string): string {
    try {
      const interface2 = this.interfaceByNameMap.get(name);
      if (interface2 === undefined) {
        throw new Error('name is not matched in interface mapping data');
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

  async loadConfig(): Promise<void> {
    const contractsList = this.configService.get<ContractConfig[]>('contracts');
    if (contractsList !== undefined) {
      try {
        for (const value of contractsList) {
          const abi = await this.fsService.getAbi(value.name);
          const interface2 = new Interface(Object.values(abi));
          const contract = new ethers.Contract(ZeroAddress, interface2);
          this.interfaceByNameMap.set(value.name, interface2);
          this.contractByNameMap.set(value.name, contract);

          this.contractList.push(value.name);
          if (value.eventList !== undefined) {
            this.contractEventListByNameMap.set(value.name, value.eventList);
          }
        }
      } catch (err) {
        this.logger.error(err);
        throw err;
      }
    }
  }

  private async initializeAsync(): Promise<void> {
    try {
      await this.loadConfig();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async onModuleInit(): Promise<void> {
    this.initPromise = this.initializeAsync();
  }
}
