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

@ApiTags('chart')
@Controller('api/chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('getReserve')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getReserve',
    description: 'getReserve',
  })
  @ApiQuery({})
  @ApiOkResponse({
    description: 'getReserve success',
    // type: ResponsePairDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getReserve(): Promise<any> {
    try {
      return await this.chartService.getReserve();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
