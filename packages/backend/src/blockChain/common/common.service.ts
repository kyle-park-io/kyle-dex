import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountService } from '../account/interfaces/account.interface';
import { RpcService } from '../rpc/interfaces/rpc.interface';
import { DecodeService } from '../utils/decode.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  type Wallet,
  type Contract,
  type TransactionRequest,
  ZeroAddress,
} from 'ethers';
import {
  type ProcessContractDto,
  type ProcessContractWithETHDto,
} from './dto/common.dto';

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
    private readonly hardhatAccountService: AccountService,
    @Inject('HardhatRpc')
    private readonly hardhatRpcService: RpcService,
    @Inject('SepoilaRpc')
    private readonly sepoliaRpcService: RpcService,
    @Inject('AmoyRpc')
    private readonly amoyRpcService: RpcService,

    private readonly decodeService: DecodeService,
  ) {}

  async query(dto: ProcessContractDto): Promise<any> {
    try {
      if (dto.network === 'sepolia' || dto.network === 'amoy') {
        return await this.queryWithContractInterface(dto);
      }
      if (dto.network !== 'hardhat') {
        throw new Error(`wrong network: ${dto.network}`);
      }
      if (dto.userAddress === ZeroAddress) {
        return await this.queryWithContractInterface(dto);
      }

      const wallet: Wallet | undefined =
        this.hardhatAccountService.getWalletByAddress(dto.userAddress);
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${dto.userAddress}`);
      }

      const contract: Contract | undefined =
        this.hardhatRpcService.getContractByAddress(dto.contractAddress);
      if (contract === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }

      const eFD = contract.interface.encodeFunctionData(dto.function, dto.args);
      const tx: TransactionRequest = { to: dto.contractAddress, data: eFD };
      const result = await wallet.call(tx);

      const contractName = this.hardhatRpcService.getContractName(
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

  async queryWithContractInterface(dto: ProcessContractDto): Promise<any> {
    try {
      const contract: Contract | undefined =
        dto.network === 'hardhat'
          ? this.hardhatRpcService.getContractByAddress(dto.contractAddress)
          : dto.network === 'sepolia'
            ? this.sepoliaRpcService.getContractByAddress(dto.contractAddress)
            : this.amoyRpcService.getContractByAddress(dto.contractAddress);
      if (contract === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }

      const result = await contract[dto.function](...dto.args);
      const contractName: string | undefined =
        dto.network === 'hardhat'
          ? this.hardhatRpcService.getContractName(dto.contractAddress)
          : dto.network === 'sepolia'
            ? this.sepoliaRpcService.getContractName(dto.contractAddress)
            : this.amoyRpcService.getContractName(dto.contractAddress);
      if (contractName === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }
      const decodedResult =
        await this.decodeService.decodeResultFromContractCall(
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
      const wallet: Wallet | undefined =
        this.hardhatAccountService.getWalletByAddress(dto.userAddress);
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${dto.userAddress}`);
      }

      const contract: Contract | undefined =
        this.hardhatRpcService.getContractByAddress(dto.contractAddress);
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

  async submitWithETH(dto: ProcessContractWithETHDto): Promise<boolean> {
    try {
      const wallet: Wallet | undefined =
        this.hardhatAccountService.getWalletByAddress(dto.userAddress);
      if (wallet === undefined) {
        throw new Error(`wallet is not existed, address : ${dto.userAddress}`);
      }

      const contract: Contract | undefined =
        this.hardhatRpcService.getContractByAddress(dto.contractAddress);
      if (contract === undefined) {
        throw new Error(
          `contract is not existed, address : ${dto.contractAddress}`,
        );
      }

      const eFD = contract.interface.encodeFunctionData(dto.function, dto.args);
      const tx: TransactionRequest = {
        to: dto.contractAddress,
        data: eFD,
        value: dto.eth,
      };
      await wallet.sendTransaction(tx);

      return true;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
