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
import { isNumberString } from 'class-validator';

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
        network: dto.network,
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
      // const cache = cacheService.get('hardhat.pairs.list');
      const cache = cacheService.get(`${dto.network}.pairs.list`);
      if (typeof cache === 'string') {
        const pairList = JSON.parse(cache);
        for (let i = 0; i < pairList.length; i++) {
          if (pairList[i].eventData.pair === dto.pairAddress) {
            const obj: ResponseTokensDto = {
              pair: pairList[i].eventData.pair,
              tokenA: pairList[i].eventData.token0,
              tokenB: pairList[i].eventData.token1,
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
        network: dto.network,
        userAddress: ZeroAddress,
        contractAddress: dto.pair,
        function: 'getReserves',
        args: [],
      });
      // totalSupply
      const totalSupply = await this.commonService.query({
        network: dto.network,
        userAddress: ZeroAddress,
        contractAddress: dto.pair,
        function: 'totalSupply',
        args: [],
      });
      // token
      const token0 = await this.commonService.query({
        network: dto.network,
        userAddress: ZeroAddress,
        contractAddress: dto.pair,
        function: 'token0',
        args: [],
      });
      const token1 = await this.commonService.query({
        network: dto.network,
        userAddress: ZeroAddress,
        contractAddress: dto.pair,
        function: 'token1',
        args: [],
      });

      if (dto.tokenA !== undefined && dto.amountA !== undefined) {
        if (token0.token0 !== dto.tokenA) {
          throw new Error(
            `token0 is not matched with tokenA\ntoken0: ${token0.token0}\ntokenA: ${dto.tokenA}`,
          );
        }
        if (
          !isNumberString(dto.amountA) ||
          BigInt(dto.amountA) <= BigInt('0')
        ) {
          throw new Error(`check amountA: ${dto.amountA}`);
        }

        const calc1 =
          (BigInt(dto.amountA) * BigInt(reserve._reserve1)) /
          BigInt(reserve._reserve0);
        const liquidity0 =
          (BigInt(dto.amountA) * BigInt(totalSupply.totalSupply)) /
          BigInt(reserve._reserve0);
        const liquidity1 =
          (calc1 * BigInt(totalSupply.totalSupply)) / BigInt(reserve._reserve1);
        const liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
        result.calc1 = {
          actual0: dto.amountA,
          expected1: calc1.toString(),
          liquidity: liquidity.toString(),
        };
      }
      if (dto.tokenB !== undefined && dto.amountB !== undefined) {
        if (token1.token1 !== dto.tokenB) {
          throw new Error(
            `token1 is not matched with tokenB\ntoken1: ${token1.token1}\ntokenB: ${dto.tokenB}`,
          );
        }
        if (
          !isNumberString(dto.amountB) ||
          BigInt(dto.amountB) <= BigInt('0')
        ) {
          throw new Error(`check amountB: ${dto.amountB}`);
        }

        const calc0 =
          (BigInt(dto.amountB) * BigInt(reserve._reserve0)) /
          BigInt(reserve._reserve1);
        const liquidity1 =
          (BigInt(dto.amountB) * BigInt(totalSupply.totalSupply)) /
          BigInt(reserve._reserve1);
        const liquidity0 =
          (calc0 * BigInt(totalSupply.totalSupply)) / BigInt(reserve._reserve0);
        const liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
        result.calc0 = {
          actual1: dto.amountB,
          expected0: calc0.toString(),
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
