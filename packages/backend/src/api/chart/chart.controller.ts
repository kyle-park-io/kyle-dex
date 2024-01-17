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
  GetPairDto,
  GetClientPairDto,
  GetClientDto,
} from './dto/chart.request';

@ApiTags('chart')
@Controller('api/chart')
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

  @Post('getPair')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getPair',
    description: 'getPair',
  })
  @ApiBody({ type: GetPairDto })
  @ApiCreatedResponse({
    description: 'getPair success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPair(@Body() dto: GetPairDto): Promise<any> {
    try {
      return await this.chartService.getPair(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getClientPair')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClientPair',
    description: 'getClientPair',
  })
  @ApiBody({ type: GetClientPairDto })
  @ApiCreatedResponse({
    description: 'getClientPair success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getClientPair(@Body() dto: GetClientPairDto): Promise<any> {
    try {
      return await this.chartService.getClientPair(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getClient')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClient',
    description: 'getClient',
  })
  @ApiBody({ type: GetClientDto })
  @ApiCreatedResponse({
    description: 'getClient success',
    // type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getClient(@Body() dto: GetClientDto): Promise<any> {
    try {
      return await this.chartService.getClient(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
