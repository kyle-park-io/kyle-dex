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
import { NetworkType2 } from '../network/dto/network.request';
import { ClientDto } from './dto/client.request';
import { ResponseClientDto } from './dto/client.response';
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
    enum: NetworkType2,
  })
  @ApiOkResponse({
    description: 'getClientList success',
    // type:
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  getClientList(@Query('network') network: NetworkType2): any {
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
        case 'hardhat': {
          return await this.hardhatClientService.getClient(dto);
        }
        case 'sepolia': {
          return await this.sepoliaClientService.getClient(dto);
        }
        case 'amoy': {
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
}
