import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountService } from '../account/interfaces/account.interface';
import { RpcService } from '../rpc/interfaces/rpc.interface';
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
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    @Inject('HardhatRpc')
    private readonly rpcService: RpcService,

    private readonly decodeService: DecodeService,
  ) {}

  async query(dto: ProcessContractDto): Promise<any> {
    try {
      const wallet: Wallet | undefined = this.accountService.getWalletByAddress(
        dto.userAddress,
      );
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${dto.userAddress}`);
      }

      const contract: Contract | undefined =
        this.rpcService.getContractByAddress(dto.contractAddress);
      if (contract === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }

      const eFD = contract.interface.encodeFunctionData(dto.function, dto.args);
      const tx: TransactionRequest = { to: dto.contractAddress, data: eFD };
      const result = await wallet.call(tx);

      const contractName = this.rpcService.getContractName(dto.contractAddress);
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
      const wallet: Wallet | undefined = this.accountService.getWalletByAddress(
        dto.userAddress,
      );
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${dto.userAddress}`);
      }

      const contract: Contract | undefined =
        this.rpcService.getContractByAddress(dto.contractAddress);
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
