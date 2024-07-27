/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Header, Post, Query, Body } from '@nestjs/common';
import { PairService } from './pair.service';
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
  GetTokensDto,
  EstimateLiquidityDto,
} from './dto/pair.request';
import {
  ResponseReserveDto,
  ResponseTokensDto,
  ResponseEstimateLiquidityDto,
} from './dto/pair.response';
import { constants } from '../../constants/constants';

@ApiTags('pair')
@Controller(`${constants.apiPrefix}/api/pair`)
export class PairController {
  constructor(private readonly pairService: PairService) {}

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
      return await this.pairService.getReserve(dto);
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
      return this.pairService.getTokens(dto);
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
  async estimateLiquidity(
    @Body() estimateLiquidityDto: EstimateLiquidityDto,
  ): Promise<any> {
    try {
      return await this.pairService.estimateLiquidity(estimateLiquidityDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
