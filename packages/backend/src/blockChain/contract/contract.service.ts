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
import { ethers, Interface, type Contract } from 'ethers';

@Injectable()
export class ContractService implements OnModuleInit {
  // map
  private readonly contractNameMap: Map<string, string>;
  private readonly contractAddressMap: Map<string, string>;
  private readonly contractMap: Map<string, Contract>;
  private readonly interfaceMap: Map<string, Interface>;

  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // extra
    private readonly fsService: FsService,
  ) {
    this.contractNameMap = new Map<string, string>();
    this.contractAddressMap = new Map<string, string>();
    this.contractMap = new Map<string, Contract>();
    this.interfaceMap = new Map<string, Interface>();
  }

  async onModuleInit(): Promise<void> {
    const contractsList = this.configService.get<ContractConfig[]>('contracts');
    if (contractsList !== undefined) {
      try {
        for (const value of contractsList) {
          const abi = await this.fsService.getAbi(value.name);
          const interface2 = new Interface(Object.values(abi));
          const contract = new ethers.Contract(value.address, interface2);
          this.interfaceMap.set(value.address, interface2);
          this.contractMap.set(value.address, contract);
          this.contractNameMap.set(value.address, value.name);
          this.contractAddressMap.set(value.name, value.address);
        }
      } catch (err) {
        this.logger.error(err);
        throw err;
      }
    }
  }

  getContractName(address: string): string | undefined {
    return this.contractNameMap.get(address);
  }

  getContractAddress(name: string): string | undefined {
    return this.contractAddressMap.get(name);
  }

  getContract(address: string): Contract | undefined {
    return this.contractMap.get(address);
  }

  getFunctionSignature(address: string, functionName: string): string {
    try {
      const interface2 = this.interfaceMap.get(address);
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
}
