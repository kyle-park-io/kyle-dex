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
import { GetReserveDto } from './dto/pair.request';

@ApiTags('pair')
@Controller('pair')
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
    type: String,
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
}
