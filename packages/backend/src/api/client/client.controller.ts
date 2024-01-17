/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Header, Post, Query, Body } from '@nestjs/common';
import { HardhatClientService } from './client.hardhat.service';
import { SepoliaClientService } from './client.sepolia.service';
import { MumbaiClientService } from './client.mumbai.service';
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

@ApiTags('client')
@Controller('api/client')
export class ClientController {
  constructor(
    private readonly hardhatClientService: HardhatClientService,
    private readonly sepoliaClientService: SepoliaClientService,
    private readonly mumbaiClientService: MumbaiClientService,
  ) {}

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
        case 'mumbai': {
          return await this.mumbaiClientService.getClient(dto);
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
