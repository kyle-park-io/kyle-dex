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

@ApiTags('utils')
@Controller('api/utils')
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
