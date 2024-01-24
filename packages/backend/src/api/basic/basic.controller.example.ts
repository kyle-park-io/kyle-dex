/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Header, Post, Query, Body } from '@nestjs/common';
import { BasicService } from './basic.service';
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

@ApiTags('basic')
@Controller('basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) {}

  // get
  @Get('')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: '',
    description: '',
  })
  @ApiOkResponse({
    description: '',
    // type:
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getA(@Query() dto: any): Promise<any> {
    try {
      return '';
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: '',
    description: '',
  })
  @ApiOkResponse({
    description: '',
    // type:
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getB(@Query() dto: any): Promise<any> {
    try {
      return '';
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // post
  @Post('')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: '',
    description: '',
  })
  @ApiBody({
    // type:
  })
  @ApiCreatedResponse({
    description: '',
    // type:
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async postA(@Body() dto: any): Promise<any> {
    try {
      return '';
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @ApiOperation({
    summary: '',
    description: '',
  })
  @ApiBody({
    // type:
  })
  @ApiCreatedResponse({
    description: '',
    // type:
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async postB(@Body() dto: any): Promise<any> {
    try {
      return '';
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
