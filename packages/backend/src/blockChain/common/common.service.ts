import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SepoliaAccountService } from '../account/account.service';
import { ContractService } from '../contract/contract.service';
import { DecodeService } from '../utils/decode.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type Wallet, type Contract } from 'ethers';

@Injectable()
export class CommonService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // extra
    private readonly sepoliaAccountService: SepoliaAccountService,
    private readonly contractService: ContractService,
    private readonly decodeService: DecodeService,
  ) {}

  async query(
    address: string,
    functionName: string,
    args: any[],
  ): Promise<any> {
    try {
      const wallet: Wallet | undefined =
        this.sepoliaAccountService.getWallet(address);
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${address}`);
      }

      const contract: Contract | undefined =
        this.contractService.getContract(address);
      if (contract === undefined) {
        throw new Error(`contract is not existed, address : ${address}`);
      }

      const contract2 = contract.connect(wallet);
      const result = await contract2[functionName](...args);

      const contractName = this.contractService.getContractName(address);
      if (contractName === undefined) {
        throw new Error(`contract is not existed, address : ${address}`);
      }
      const decodedResult = await this.decodeService.decodeResult(
        contractName,
        functionName,
        result,
      );
      return decodedResult;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async submit(
    address: string,
    functionName: string,
    args: any[],
  ): Promise<boolean> {
    try {
      const wallet: Wallet | undefined =
        this.sepoliaAccountService.getWallet(address);
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${address}`);
      }

      const contract: Contract | undefined =
        this.contractService.getContract(address);
      if (contract === undefined) {
        throw new Error(`contract is not existed, address : ${address}`);
      }

      const contract2 = contract.connect(wallet);
      await contract2[functionName](...args);

      return true;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
