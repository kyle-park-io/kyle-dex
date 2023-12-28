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
import { QueryContractDto, SubmitContractDto } from './dto/common.request';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';

@ApiTags('common')
@Controller('api/common')
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
  @ApiBody({ type: QueryContractDto })
  @ApiCreatedResponse({
    description: 'Successfully Query contract',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async query(@Body() queryContract: QueryContractDto): Promise<any> {
    try {
      const args: ProcessContractDto = {
        userAddress: queryContract.userAddress,
        contractAddress: queryContract.contractAddress,
        function: queryContract.function,
        args: queryContract.args,
      };
      const result = await this.commonService.query(args);
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
  @ApiBody({ type: SubmitContractDto })
  @ApiCreatedResponse({
    description: 'Successfully submit transaction',
    type: Boolean,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async submit(@Body() submitContract: SubmitContractDto): Promise<boolean> {
    try {
      const args: ProcessContractDto = {
        userAddress: submitContract.userAddress,
        contractAddress: submitContract.contractAddress,
        function: submitContract.function,
        args: submitContract.args,
      };
      await this.commonService.submit(args);
      return true;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
