import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService } from '../../blockChain/common/common.service';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { ContractService } from '../../blockChain/contract/contract.service';
import { FsService } from '../../blockChain/utils/fs.service';
import {
  type CalcPairDto,
  type Create2Dto,
  type EstimateLiquidityDto,
} from './dto/utils.request.dto';
import { type ResponsePairDto } from './dto/utils.response.dto';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';
import { keccak256, solidityPackedKeccak256, getCreate2Address } from 'ethers';

@Injectable()
export class UtilsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    private readonly contractService: ContractService,
    private readonly fsService: FsService,
  ) {}

  async calcPair(dto: CalcPairDto): Promise<ResponsePairDto> {
    try {
      // user
      let userAddress;
      if (dto.userAddress === undefined && dto.userName === undefined) {
        throw new Error('check user params');
      } else if (dto.userAddress !== undefined) {
        userAddress = dto.userAddress;
      } else if (dto.userName !== undefined) {
        const wallet = this.accountService.getWalletByName(dto.userName);
        if (wallet === undefined) {
          throw new Error('user is not existed');
        }
        userAddress = wallet.address;
      }
      // contract
      const contractAddress: string | undefined =
        this.contractService.getContractAddress(dto.contractName);
      if (contractAddress === undefined) {
        throw new Error('contract is not existed');
      }

      const args: ProcessContractDto = {
        userAddress,
        contractAddress,
        function: 'calcPair',
        args: [dto.factory, dto.tokenA, dto.tokenB],
      };
      const address = await this.commonService.query(args);

      // const name = this.contractService.getContractName(address.result);
      // if (name === undefined) {
      //   throw new Error('pair contract is not existed');
      // }
      const name = 'pair';
      const result: ResponsePairDto = { name, address: address.result };
      return result;
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

  async estimateLiquidity(dto: EstimateLiquidityDto): Promise<any> {
    try {
      // const result = await this.commonService.query(
      //   'Pair',
      //   'getReserves',
      //   [],
      //   dto.pair,
      // );
      // console.log(result);
      // const result2 = await this.commonService.query(
      //   'Pair',
      //   'totalSupply',
      //   [],
      //   dto.pair,
      // );
      // console.log(result2);
      // return result;
    } catch (err) {
      this.logger.error('estimate liquidity error');
      throw err;
    }
  }
}
