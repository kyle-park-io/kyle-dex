/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Header, Query, Body } from '@nestjs/common';
import { TokenService } from './token.service';
import {
  ApiQuery,
  ApiBody,
  ApiOperation, // endpoint
  ApiTags, // tag
  ApiBearerAuth,
  ApiOkResponse, // 200
  ApiBadRequestResponse, // 400
  ApiNotFoundResponse, // 404
  ApiInternalServerErrorResponse, // 500
  ApiExcludeEndpoint,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { BalanceOfDto } from './dto/token.request.dto';
import { ResponseBalanceOfDto } from './dto/token.response.dto';
import { constants } from '../../constants/constants';
import { NetworkType } from '../network/dto/network.request';

@ApiTags('token')
@Controller(`${constants.apiPrefix}/api/token`)
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('balanceOf')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'balanceOf',
    description: 'balanceOf',
  })
  @ApiBody({ type: BalanceOfDto })
  @ApiCreatedResponse({
    description: 'balanceOf success',
    type: ResponseBalanceOfDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async balanceOf(
    @Body() balanceOfDto: BalanceOfDto,
  ): Promise<ResponseBalanceOfDto> {
    try {
      return await this.tokenService.balanceOf(balanceOfDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get('getTokenContractList')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'getTokenContractList',
    description: 'getTokenContractList',
  })
  @ApiQuery({
    name: 'network',
    enum: NetworkType,
  })
  @ApiOkResponse({
    description: 'getTokenContractList success',
    // type: ResponseBalanceOfDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getTokenContractList(
    @Query('network') network: NetworkType,
  ): Promise<any> {
    try {
      return await this.tokenService.getTokenContractList(network);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
