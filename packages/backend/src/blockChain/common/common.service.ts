import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SepoliaAccountService } from '../account/account.service';
import { ContractService } from '../contract/contract.service';
import { DecodeService } from '../utils/decode.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type Wallet, type Contract, type TransactionRequest } from 'ethers';
import { type ProcessContractDto } from './dto/common.dto';

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

  async query(dto: ProcessContractDto): Promise<any> {
    try {
      const wallet: Wallet | undefined = this.sepoliaAccountService.getWallet(
        dto.userAddress,
      );
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${dto.userAddress}`);
      }

      const contract: Contract | undefined = this.contractService.getContract(
        dto.contractAddress,
      );
      if (contract === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }

      const eFD = contract.interface.encodeFunctionData(dto.function, dto.args);
      const tx: TransactionRequest = { to: dto.contractAddress, data: eFD };
      const result = await wallet.call(tx);

      const contractName = this.contractService.getContractName(
        dto.contractAddress,
      );
      if (contractName === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }

      const decodedResult = await this.decodeService.decodeResult(
        contractName,
        dto.function,
        result,
      );
      return decodedResult;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async submit(dto: ProcessContractDto): Promise<boolean> {
    try {
      const wallet: Wallet | undefined = this.sepoliaAccountService.getWallet(
        dto.userAddress,
      );
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${dto.userAddress}`);
      }

      const contract: Contract | undefined = this.contractService.getContract(
        dto.contractAddress,
      );
      if (contract === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }

      const eFD = contract.interface.encodeFunctionData(dto.function, dto.args);
      const tx: TransactionRequest = { to: dto.contractAddress, data: eFD };
      await wallet.sendTransaction(tx);

      return true;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
