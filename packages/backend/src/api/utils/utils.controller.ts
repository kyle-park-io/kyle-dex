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
import { CalcPairDto } from './dto/utils.request.dto';
import { ResponsePairDto } from './dto/utils.response.dto';

@ApiTags('utils')
@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Post('calcPair')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'calulate pair address',
    description: 'calulate pair address',
  })
  @ApiBody({
    type: CalcPairDto,
  })
  @ApiCreatedResponse({
    description: 'calulate pair address success',
    type: ResponsePairDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async calcPair(@Body() calcPairDto: CalcPairDto): Promise<ResponsePairDto> {
    try {
      return await this.utilsService.calcPair(calcPairDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
