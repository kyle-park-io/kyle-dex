import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RpcService } from '../../blockChain/rpc/interfaces/rpc.interface';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { CommonService } from '../../blockChain/common/common.service';
import cacheService from '../../init/cache';
// dto
import {
  type GetReserveDto,
  type GetTokensDto,
  type EstimateLiquidityDto,
} from './dto/pair.request';
import { type ResponseTokensDto } from './dto/pair.response';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';
import { ZeroAddress } from 'ethers';

@Injectable()
export class PairService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // rpc
    @Inject('HardhatRpc')
    private readonly rpcService: RpcService,
    // account
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    // extra
    private readonly commonService: CommonService,
  ) {}

  async getReserve(dto: GetReserveDto): Promise<any> {
    try {
      const queryDto: ProcessContractDto = {
        userAddress: ZeroAddress,
        contractAddress: dto.pairAddress,
        function: 'getReserves',
        args: [],
      };
      return await this.commonService.query(queryDto);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getTokens(dto: GetTokensDto): Promise<any> {
    try {
      const cache = cacheService.get('hardhat.pairs.list');
      if (typeof cache === 'string') {
        const pairList = JSON.parse(cache);
        for (let i = 0; i < pairList.length; i++) {
          if (pairList[i].pair === dto.pairAddress) {
            const obj: ResponseTokensDto = {
              pair: dto.pairAddress,
              tokenA: pairList[i].token0,
              tokenB: pairList[i].token1,
            };
            return obj;
          }
        }
      }
      throw new Error('pair is not existed');
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async estimateLiquidity(dto: EstimateLiquidityDto): Promise<any> {
    try {
      const result: any = {};
      result.pair = dto.pair;
      // reserve
      const reserve = await this.commonService.query({
        userAddress: ZeroAddress,
        contractAddress: dto.pair,
        function: 'getReserves',
        args: [],
      });
      // totalSupply
      const totalSupply = await this.commonService.query({
        userAddress: ZeroAddress,
        contractAddress: dto.pair,
        function: 'totalSupply',
        args: [],
      });

      if (dto.tokenA !== undefined && dto.amountA !== undefined) {
        const calcB =
          (BigInt(dto.amountA) * BigInt(reserve._reserve1)) /
          BigInt(reserve._reserve0);
        const liquidityA =
          (BigInt(dto.amountA) * BigInt(totalSupply.totalSupply)) /
          BigInt(reserve._reserve0);
        const liquidityB =
          (calcB * BigInt(totalSupply.totalSupply)) / BigInt(reserve._reserve1);
        const liquidity = liquidityA < liquidityB ? liquidityA : liquidityB;
        result.calcB = {
          actualA: dto.amountA,
          expectedB: calcB.toString(),
          liquidity: liquidity.toString(),
        };
      }
      if (dto.tokenB !== undefined && dto.amountB !== undefined) {
        const calcA =
          (BigInt(dto.amountB) * BigInt(reserve._reserve0)) /
          BigInt(reserve._reserve1);
        const liquidityB =
          (BigInt(dto.amountB) * BigInt(totalSupply.totalSupply)) /
          BigInt(reserve._reserve1);
        const liquidityA =
          (calcA * BigInt(totalSupply.totalSupply)) / BigInt(reserve._reserve0);
        const liquidity = liquidityA < liquidityB ? liquidityA : liquidityB;
        result.calcA = {
          actualB: dto.amountB,
          expectedA: calcA.toString(),
          liquidity: liquidity.toString(),
        };
      }
      if (Object.keys(result).length === 1) {
        throw new Error('token param must exist least one');
      }
      return result;
    } catch (err) {
      this.logger.error('estimate liquidity error');
      throw err;
    }
  }
}
