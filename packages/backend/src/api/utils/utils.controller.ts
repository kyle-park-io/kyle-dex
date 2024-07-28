/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Header, Post, Query, Body } from '@nestjs/common';
import { UtilsService } from './utils.service';
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
import { CalcPairDto, Create2Dto } from './dto/utils.request.dto';
import { ResponsePairDto } from './dto/utils.response.dto';
import { constants } from '../../constants/constants';
import { NetworkType } from '../network/dto/network.request';

@ApiTags('utils')
@Controller(`${constants.apiPrefix}/api/utils`)
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get('getWETH')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'getWETH',
    description: 'getWETH',
  })
  @ApiQuery({
    name: 'network',
    enum: NetworkType,
  })
  @ApiOkResponse({
    description: 'getWETH success',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getWETH(@Query('network') network: NetworkType): Promise<string> {
    try {
      return await this.utilsService.getWETH(network);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('getFactory')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'getFactory',
    description: 'getFactory',
  })
  @ApiQuery({
    name: 'network',
    enum: NetworkType,
  })
  @ApiOkResponse({
    description: 'getFactory success',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getFactory(@Query('network') network: NetworkType): Promise<string> {
    try {
      return await this.utilsService.getFactory(network);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('getRouter')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'getRouter',
    description: 'getRouter',
  })
  @ApiQuery({
    name: 'network',
    enum: NetworkType,
  })
  @ApiOkResponse({
    description: 'getRouter success',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getRouter(@Query('network') network: NetworkType): Promise<string> {
    try {
      return await this.utilsService.getRouter(network);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('calcPair')
  // @Header('Content-Type', 'application/json')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'calulate pair address',
    description: 'calulate pair address',
  })
  @ApiBody({
    type: CalcPairDto,
  })
  @ApiCreatedResponse({
    description: 'calulate pair address success',
    // type: ResponsePairDto,
    type: String,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async calcPair(@Body() calcPairDto: CalcPairDto): Promise<string> {
    try {
      return await this.utilsService.calcPair(calcPairDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('create2')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'calculate create2 pair address',
    description: 'calculate create2 pair address',
  })
  @ApiCreatedResponse({
    description: 'calculate create2 pair address success',
    type: String,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create2(@Body() create2Dto: Create2Dto): Promise<string> {
    try {
      return await this.utilsService.create2(create2Dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
