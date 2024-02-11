import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService } from '../../blockChain/common/common.service';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { RpcService } from '../../blockChain/rpc/interfaces/rpc.interface';
import { FsService } from '../../blockChain/utils/fs.service';
import { type CalcPairDto, type Create2Dto } from './dto/utils.request.dto';
import { type ResponsePairDto } from './dto/utils.response.dto';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';
import {
  keccak256,
  solidityPackedKeccak256,
  getCreate2Address,
  ZeroAddress,
} from 'ethers';

@Injectable()
export class UtilsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    @Inject('HardhatRpc')
    private readonly rpcService: RpcService,
    private readonly fsService: FsService,
  ) {}

  async getWETH(): Promise<string> {
    try {
      // contract
      const contractAddress: string | undefined =
        this.rpcService.getContractAddress('Router');
      if (contractAddress === undefined) {
        throw new Error('contract is not existed');
      }
      const args: ProcessContractDto = {
        userAddress: ZeroAddress,
        contractAddress,
        function: 'WETH',
        args: [],
      };

      const result = await this.commonService.query(args);
      return result.WETH;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getFactory(): Promise<string> {
    try {
      // contract
      const contractAddress: string | undefined =
        this.rpcService.getContractAddress('Router');
      if (contractAddress === undefined) {
        throw new Error('contract is not existed');
      }
      const args: ProcessContractDto = {
        userAddress: ZeroAddress,
        contractAddress,
        function: 'factory',
        args: [],
      };

      const result = await this.commonService.query(args);
      return result.factory;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getRouter(): Promise<string> {
    try {
      const address = this.rpcService.getContractAddress('Router');
      if (address === undefined) {
        throw new Error('router address is not existed');
      }
      return address;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async calcPair(dto: CalcPairDto): Promise<string> {
    try {
      // user
      let userAddress;
      if (dto.userAddress === undefined && dto.userName === undefined) {
        // throw new Error('check user params');
        userAddress = ZeroAddress;
      } else if (dto.userAddress !== undefined) {
        userAddress = dto.userAddress;
      } else if (dto.userName !== undefined) {
        const wallet = this.accountService.getWalletByName(dto.userName);
        if (wallet === undefined) {
          throw new Error('user is not existed');
        }
        userAddress = wallet.address;
      }
      if (dto.userName !== undefined && dto.userAddress !== undefined) {
        const address = this.accountService.getAddressByName(dto.userName);
        if (dto.userAddress !== address) {
          throw new Error('user name is unmatched by user address');
        }
      }
      // contract
      const contractAddress: string | undefined =
        this.rpcService.getContractAddress(dto.contractName);
      if (contractAddress === undefined) {
        throw new Error('contract is not existed');
      }
      const args: ProcessContractDto = {
        userAddress,
        contractAddress,
        function: 'calcPair',
        args: [dto.factory, dto.tokenA, dto.tokenB],
      };

      const result = await this.commonService.query(args);
      return result.calcPair;
    } catch (err) {
      this.logger.error('calcPair error');
      throw err;
    }
  }

  async create2(dto: Create2Dto): Promise<string> {
    try {
      const bytecode = await this.fsService.getBytecode('Pair');
      const salt = solidityPackedKeccak256(
        ['address', 'address'],
        [dto.tokenA, dto.tokenB],
      );
      const address = getCreate2Address(dto.factory, salt, keccak256(bytecode));
      return address;
    } catch (err) {
      this.logger.error('create2 error');
      throw err;
    }
  }
}
