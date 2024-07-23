/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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
import { CreateTokenDto, CheckTokenDto } from './dto/auth.request.dto';
import { ResponseCreateTokenDto } from './dto/auth.response.dto';
import { type JWT } from './interfaces/auth.interface';
import { constants } from '../../constants/constants';

@ApiTags('auth')
@Controller(`${constants.apiPrefix}/api/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'create jwt',
    description: 'create jwt',
  })
  @ApiCreatedResponse({
    description: 'create jwt success',
    type: ResponseCreateTokenDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createToken(
    @Body() dto: CreateTokenDto,
  ): Promise<ResponseCreateTokenDto> {
    try {
      return await this.authService.createToken(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('check')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: 'check jwt',
    description: 'check jwt',
  })
  @ApiCreatedResponse({
    description: 'check jwt success',
    type: Boolean,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async checkToken(@Body() dto: CheckTokenDto): Promise<JWT> {
    try {
      return await this.authService.checkToken(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
