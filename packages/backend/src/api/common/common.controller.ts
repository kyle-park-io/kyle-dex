/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Inject,
  LoggerService,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Headers,
  Header,
  Req,
} from '@nestjs/common';
import {
  ApiTags, // tag
  ApiOperation, // endpoint
  ApiBearerAuth, // bearer
  ApiBody,
  ApiOkResponse, // 200
  ApiCreatedResponse, // 201
  ApiBadRequestResponse, // 400
  ApiNotFoundResponse, // 404
  ApiInternalServerErrorResponse, // 500
  // exclude
  ApiExcludeController,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { CommonService } from './common.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// dto
import { QueryContract, SubmitContractTransaction } from './dto/common.request';

@ApiTags('common')
@Controller('common')
export class CommonController {
  constructor(
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
  ) {}

  @Post('query')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'Query contract',
    description: 'Query contract',
  })
  @ApiBody({ type: QueryContract })
  @ApiCreatedResponse({
    description: 'Successfully Query contract',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async query(@Body() queryContract: QueryContract): Promise<any> {
    try {
      const result = await this.commonService.query(queryContract);
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Post('submit')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'Submit contract transaction',
    description: 'Submit transaction',
  })
  @ApiBody({ type: SubmitContractTransaction })
  @ApiCreatedResponse({
    description: 'Successfully submit transaction',
    type: Boolean,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async submit(
    @Body() submitContractTransaction: SubmitContractTransaction,
  ): Promise<boolean> {
    try {
      await this.commonService.submit(submitContractTransaction);
      return true;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
