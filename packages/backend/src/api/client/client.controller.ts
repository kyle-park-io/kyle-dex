/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Header, Post, Query, Body } from '@nestjs/common';
import { HardhatClientService } from './client.hardhat.service';
import { SepoliaClientService } from './client.sepolia.service';
import { AmoyClientService } from './client.amoy.service';
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
import { ClientDto } from './dto/client.request';
import { ResponseClientDto } from './dto/client.response';
import {
  NetworkType,
  OnlyHardhatNetworkType,
} from '../network/dto/network.request';
import { constants } from '../../constants/constants';

@ApiTags('client')
@Controller(`${constants.apiPrefix}/api/client`)
export class ClientController {
  constructor(
    private readonly hardhatClientService: HardhatClientService,
    private readonly sepoliaClientService: SepoliaClientService,
    private readonly amoyClientService: AmoyClientService,
  ) {}

  @Get('getClientList')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClientList',
    description: 'getClientList',
  })
  @ApiQuery({
    name: 'network',
    enum: OnlyHardhatNetworkType,
  })
  @ApiOkResponse({
    description: 'getClientList success',
    // type:
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  getClientList(@Query('network') network: OnlyHardhatNetworkType): any {
    try {
      return this.hardhatClientService.getClientList();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('getClient')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClient',
    description: 'getClient',
  })
  @ApiBody({ type: ClientDto })
  @ApiCreatedResponse({
    description: 'getClient success',
    type: ResponseClientDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getClient(@Body() dto: ClientDto): Promise<any> {
    try {
      switch (dto.network) {
        case NetworkType.hardhat: {
          return await this.hardhatClientService.getClient(dto);
        }
        case NetworkType.sepolia: {
          return await this.sepoliaClientService.getClient(dto);
        }
        case NetworkType.amoy: {
          return await this.amoyClientService.getClient(dto);
        }
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('getClientBalanceOf')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getClientBalanceOf',
    description: 'getClientBalanceOf',
  })
  @ApiBody({ type: ClientDto })
  @ApiCreatedResponse({
    description: 'getClientBalanceOf success',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getClientBalanceOf(@Body() dto: ClientDto): any {
    try {
      switch (dto.network) {
        case NetworkType.hardhat: {
          return this.hardhatClientService.getClientBalanceOf(dto);
        }
        case NetworkType.sepolia: {
          return this.sepoliaClientService.getClientBalanceOf(dto);
        }
        case NetworkType.amoy: {
          return this.amoyClientService.getClientBalanceOf(dto);
        }
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
