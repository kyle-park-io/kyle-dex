import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
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
  type EstimateSwapRatioDto,
  type GetMyLiquidityDto,
} from './dto/pair.request';
import { type ResponseTokensDto } from './dto/pair.response';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';
import { ZeroAddress } from 'ethers';
import { isNumberString } from 'class-validator';
import axios from 'axios';

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

  async getMyLiquidity(dto: GetMyLiquidityDto): Promise<any> {
    try {
      const pairs = this.rpcService.getPairContractList();
      if (pairs === null) {
        throw new NotFoundException('pair contracts are not existed');
      }

      const arr: any = [];
      for (const value of pairs) {
        const queryDto: ProcessContractDto = {
          network: dto.network,
          userAddress: ZeroAddress,
          contractAddress: value.address,
          function: 'balanceOf',
          args: [dto.address],
        };
        const balanceOf = await this.commonService.query(queryDto);
        arr.push({ pair: value, balanceOf: balanceOf.balanceOf });
      }
      return arr;
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

  // current only hardhat
  async estimateSwapRatio(dto: EstimateSwapRatioDto): Promise<any> {
    const result: any[] = [];
    let error: any = null;
    try {
      const tokenArray = this.rpcService.getTokenContractList();
      if (tokenArray === null) {
        throw new Error('Token contracts is not existed');
      }
      const weth = this.rpcService.getContractAddress('Router');
      if (weth === undefined) {
        throw new Error('Router contract is not existed');
      }
      const dexCalc = this.rpcService.getContractAddress('DexCalc');
      if (dexCalc === undefined) {
        throw new Error('DexCalc contract is not existed');
      }
      const factory = this.rpcService.getContractAddress('Factory');
      if (factory === undefined) {
        throw new Error('Factory contract is not existed');
      }

      if (
        !isNumberString(dto.inputAmount) ||
        BigInt(dto.inputAmount) <= BigInt('0')
      ) {
        throw new Error(`check inputAmount: ${dto.inputAmount}`);
      }
      let resultAmount = dto.inputAmount;

      const checkMap = new Map<string, boolean>();
      checkMap.set(dto.tokens[0], true);
      const pairArr: any[] = [];
      for (let i = 0; i < dto.tokens.length - 1; i++) {
        const pair = await this.commonService.query({
          network: dto.network,
          userAddress: ZeroAddress,
          contractAddress: dexCalc,
          function: 'calcPair',
          args: [factory, dto.tokens[i], dto.tokens[i + 1]],
        });
        pairArr.push(pair.calcPair);
        result.push({
          pair: pair.calcPair,
          token0: dto.tokens[i],
          token1: dto.tokens[i + 1],
          input: resultAmount,
        });

        const reserve: any = cacheService.get(
          `${dto.network}.pair.current.reserve.${pair.calcPair}`,
        );
        if (reserve === undefined || reserve === null) {
          throw new Error('reserve is not existed');
        }

        const token0 = dto.tokens[i];
        const token1 = dto.tokens[i + 1];
        let reserve0 = '0';
        let reserve1 = '0';

        if (checkMap.get(token1) !== undefined) {
          throw new Error('Duplicated token!');
        }
        checkMap.set(token1, true);
        const parsed = JSON.parse(reserve);
        if (token0.toLowerCase() < token1.toLowerCase()) {
          reserve0 = parsed.eventData.reserve0;
          reserve1 = parsed.eventData.reserve1;
        } else {
          reserve0 = parsed.eventData.reserve1;
          reserve1 = parsed.eventData.reserve0;
        }
        if (reserve0 === '0' || reserve1 === '0') {
          throw new Error('reserve 0!');
        }
        result[i].reserve0 = reserve0;
        result[i].reserve1 = reserve1;

        resultAmount = BigInt(
          (BigInt(resultAmount) * BigInt(reserve1)) / BigInt(reserve0),
        ).toString();
        if (resultAmount === '0') {
          throw new Error('calc result 0!');
        }
        result[i].output = resultAmount;

        if (BigInt(reserve1) <= BigInt(resultAmount)) {
          throw new Error('The constant product is broken!');
        }
      }
    } catch (err) {
      this.logger.error('estimate swap ratio error');
      error = axios.AxiosError.from(err);
    }
    return { result, error };
  }
}
