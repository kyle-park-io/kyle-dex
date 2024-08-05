/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Header, Post, Query, Body } from '@nestjs/common';
import { ChartService } from './chart.service';
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
  GetPairListDto,
  GetPairsDto,
  GetPairDto,
  GetTokenDto,
  GetClientEventAllDto,
  GetClientPairEventDto,
  GetClientTokenEventDto,
} from './dto/chart.request';
import { constants } from '../../constants/constants';

@ApiTags('chart')
@Controller(`${constants.apiPrefix}/api/chart`)
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post('getPairList')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getPairList',
    description: 'getPairList',
  })
  @ApiBody({ type: GetPairListDto })
  @ApiCreatedResponse({
    description: 'getPairList success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPairList(@Body() dto: GetPairListDto): Promise<any> {
    try {
      return await this.chartService.getPairList(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getPairProperty')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getPairProperty',
    description: 'getPairProperty',
  })
  @ApiBody({ type: GetPairDto })
  @ApiCreatedResponse({
    description: 'getPairProperty success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPairProperty(@Body() dto: GetPairDto): Promise<any> {
    try {
      return await this.chartService.getPairProperty(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getPairsCurrentReserve')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getPairsCurrentReserve',
    description: 'getPairsCurrentReserve',
  })
  @ApiBody({ type: GetPairsDto })
  @ApiCreatedResponse({
    description: 'getPairsCurrentReserve success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPairsCurrentReserve(@Body() dto: GetPairsDto): Promise<any> {
    try {
      return await this.chartService.getPairsCurrentReserve(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getPairCurrentReserve')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getPairCurrentReserve',
    description: 'getPairCurrentReserve',
  })
  @ApiBody({ type: GetPairDto })
  @ApiCreatedResponse({
    description: 'getPairCurrentReserve success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPairCurrentReserve(@Body() dto: GetPairDto): Promise<any> {
    try {
      return await this.chartService.getPairCurrentReserve(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getPairReserveAll')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getPairReserveAll',
    description: 'getPairReserveAll',
  })
  @ApiBody({ type: GetPairDto })
  @ApiCreatedResponse({
    description: 'getPairReserveAll success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPairReserveAll(@Body() dto: GetPairDto): Promise<any> {
    try {
      return await this.chartService.getPairReserveAll(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // pair event
  @Post('getPairEventAll')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getPairEventAll',
    description: 'getPairEventAll',
  })
  @ApiBody({ type: GetPairDto })
  @ApiCreatedResponse({
    description: 'getPairEventAll success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPairEventAll(@Body() dto: GetPairDto): Promise<any> {
    try {
      return await this.chartService.getPairEventAll(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getClientPairsEvent')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClientPairsEvent',
    description: 'getClientPairsEvent',
  })
  @ApiBody({ type: GetClientEventAllDto })
  @ApiCreatedResponse({
    description: 'getClientPairsEvent success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getClientPairsEvent(@Body() dto: GetClientEventAllDto): Promise<any> {
    try {
      return await this.chartService.getClientPairsEvent(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getClientPairEvent')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClientPairEvent',
    description: 'getClientPairEvent',
  })
  @ApiBody({ type: GetClientPairEventDto })
  @ApiCreatedResponse({
    description: 'getClientPairEvent success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getClientPairEvent(@Body() dto: GetClientPairEventDto): Promise<any> {
    try {
      return await this.chartService.getClientPairEvent(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // token event
  @Post('getTokenEventAll')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getTokenEventAll',
    description: 'getTokenEventAll',
  })
  @ApiBody({ type: GetTokenDto })
  @ApiCreatedResponse({
    description: 'getTokenEventAll success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getTokenEventAll(@Body() dto: GetTokenDto): Promise<any> {
    try {
      return await this.chartService.getTokenEventAll(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getClientTokensEvent')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClientTokensEvent',
    description: 'getClientTokensEvent',
  })
  @ApiBody({ type: GetClientEventAllDto })
  @ApiCreatedResponse({
    description: 'getClientTokensEvent success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getClientTokensEvent(@Body() dto: GetClientEventAllDto): Promise<any> {
    try {
      return await this.chartService.getClientTokensEvent(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getClientTokenEvent')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClientTokenEvent',
    description: 'getClientTokenEvent',
  })
  @ApiBody({ type: GetClientTokenEventDto })
  @ApiCreatedResponse({
    description: 'getClientTokenEvent success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getClientTokenEvent(@Body() dto: GetClientTokenEventDto): Promise<any> {
    try {
      return await this.chartService.getClientTokenEvent(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
