/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Header, Post, Query, Body } from '@nestjs/common';
import { HardhatPairService } from './pair.hardhat.service';
import { SepoliaPairService } from './pair.sepolia.service';
import { AmoyPairService } from './pair.amoy.service';
import {
  ApiQuery,
  ApiBody,
  ApiProduces,
  ApiOperation, // endpoint
  ApiTags, // tag
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiOkResponse, // 200
  ApiCreatedResponse, // 201
  ApiAcceptedResponse, // 202
  ApiBadRequestResponse, // 400
  ApiNotFoundResponse, // 404
  ApiInternalServerErrorResponse, // 500
} from '@nestjs/swagger';
// dto
import {
  GetReserveDto,
  GetMyLiquidityDto,
  GetTokensDto,
  EstimateLiquidityDto,
  EstimateSwapRatioDto,
} from './dto/pair.request';
import {
  ResponseReserveDto,
  ResponseTokensDto,
  ResponseEstimateLiquidityDto,
} from './dto/pair.response';
import { constants } from '../../constants/constants';
import { NetworkType } from '../network/dto/network.request';

@ApiTags('pair')
@Controller(`${constants.apiPrefix}/api/pair`)
export class PairController {
  constructor(
    private readonly hardhatPairService: HardhatPairService,
    private readonly sepoliaPairService: SepoliaPairService,
    private readonly amoyPairService: AmoyPairService,
  ) {}

  @Post('getReserve')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getReserve',
    description: 'getReserve',
  })
  @ApiCreatedResponse({
    description: 'getReserve success',
    type: ResponseReserveDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getReserve(@Body() dto: GetReserveDto): Promise<any> {
    try {
      switch (dto.network) {
        case NetworkType.hardhat: {
          return await this.hardhatPairService.getReserve(dto);
        }
        case NetworkType.sepolia: {
          return await this.sepoliaPairService.getReserve(dto);
        }
        case NetworkType.amoy: {
          return await this.amoyPairService.getReserve(dto);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getMyLiquidity')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getMyLiquidity',
    description: 'getMyLiquidity',
  })
  @ApiCreatedResponse({
    description: 'getMyLiquidity success',
    // type: ResponseReserveDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getMyLiquidity(@Body() dto: GetMyLiquidityDto): Promise<any> {
    try {
      switch (dto.network) {
        case NetworkType.hardhat: {
          return await this.hardhatPairService.getMyLiquidity(dto);
        }
        case NetworkType.sepolia: {
          return await this.sepoliaPairService.getMyLiquidity(dto);
        }
        case NetworkType.amoy: {
          return await this.amoyPairService.getMyLiquidity(dto);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getTokens')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getTokens',
    description: 'getTokens',
  })
  @ApiCreatedResponse({
    description: 'getTokens success',
    type: ResponseTokensDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getTokens(@Body() dto: GetTokensDto): any {
    try {
      switch (dto.network) {
        case NetworkType.hardhat: {
          return this.hardhatPairService.getTokens(dto);
        }
        case NetworkType.sepolia: {
          return this.sepoliaPairService.getTokens(dto);
        }
        case NetworkType.amoy: {
          return this.amoyPairService.getTokens(dto);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('estimateLiquidity')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'estimate min liquidity',
    description: 'estimate min liquidity',
  })
  @ApiCreatedResponse({
    description: 'estimate min liquidity success',
    type: ResponseEstimateLiquidityDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async estimateLiquidity(@Body() dto: EstimateLiquidityDto): Promise<any> {
    try {
      switch (dto.network) {
        case NetworkType.hardhat: {
          return await this.hardhatPairService.estimateLiquidity(dto);
        }
        case NetworkType.sepolia: {
          return await this.sepoliaPairService.estimateLiquidity(dto);
        }
        case NetworkType.amoy: {
          return await this.amoyPairService.estimateLiquidity(dto);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('estimateSwapRatio')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'estimate swap ratio',
    description: 'estimate swap ratio',
  })
  @ApiCreatedResponse({
    description: 'estimate swap ratio success',
    // type: ,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async estimateSwapRatio(@Body() dto: EstimateSwapRatioDto): Promise<any> {
    try {
      switch (dto.network) {
        case NetworkType.hardhat: {
          return await this.hardhatPairService.estimateSwapRatio(dto);
        }
        case NetworkType.sepolia: {
          return await this.sepoliaPairService.estimateSwapRatio(dto);
        }
        case NetworkType.amoy: {
          return await this.amoyPairService.estimateSwapRatio(dto);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
