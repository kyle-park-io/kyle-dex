/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  Body,
  ConsoleLogger,
} from '@nestjs/common';
import { NetworkService } from './network.service';
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
import { NetworkType } from './dto/network.request';
import { constants } from '../../constants/constants';
import { Provider, type Network } from 'ethers';

@ApiTags('network')
@Controller(`${constants.apiPrefix}/api/network`)
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get('getNetwork')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getNetwork',
    description: 'getNetwork',
  })
  @ApiQuery({
    name: 'network',
    enum: NetworkType,
  })
  @ApiOkResponse({
    description: 'get network success',
  })
  async getNetwork(
    @Query('network') network: NetworkType,
  ): Promise<Network | string> {
    try {
      const n: Provider = this.networkService.getNetwork(network);
      return await n.getNetwork();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get('reconnectNetwork')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'reconnectNetwork',
    description: 'reconnectNetwork',
  })
  @ApiQuery({
    name: 'network',
    enum: NetworkType,
  })
  @ApiOkResponse({
    description: 'reconnect network success',
    type: String,
  })
  async reconnectNetwork(
    @Query('network') network: NetworkType,
  ): Promise<string> {
    try {
      return await this.networkService.reconnectNetwork(network);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get('reconnectEventListener')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'reconnectEventListener',
    description: 'reconnectEventListener',
  })
  @ApiQuery({
    name: 'network',
    enum: NetworkType,
  })
  @ApiOkResponse({
    description: 'reconnect event-listener success',
    type: String,
  })
  async reconnectEventListener(
    @Query('network') network: NetworkType,
  ): Promise<string> {
    try {
      return await this.networkService.reconnectEventListener(network);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
