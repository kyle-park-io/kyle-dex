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
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { RpcService } from '../../blockChain/rpc/interfaces/rpc.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// dto
import {
  QueryContractDto,
  SubmitContractDto,
  SubmitContractWithETHDto,
} from './dto/common.request';
import {
  type ProcessContractDto,
  type ProcessContractWithETHDto,
} from '../../blockChain/common/dto/common.dto';
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers';
import { constants } from '../../constants/constants';

@ApiTags('common')
@Controller(`${constants.apiPrefix}/api/common`)
export class CommonController {
  constructor(
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    @Inject('HardhatRpc')
    private readonly rpcService: RpcService,
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
  async query(@Body() dto: QueryContractDto): Promise<any> {
    try {
      // user
      let userAddress;
      if (dto.userAddress === undefined && dto.userName === undefined) {
        throw new Error('check user params');
      } else if (dto.userAddress !== undefined) {
        userAddress = dto.userAddress;
      } else if (dto.userName !== undefined) {
        const wallet = this.accountService.getWalletByName(dto.userName);
        if (wallet === undefined) {
          throw new Error('user is not existed');
        }
        userAddress = wallet.address;
      }
      // contract
      let contractAddress;
      if (dto.contractAddress === undefined && dto.contractName === undefined) {
        throw new Error('check contract params');
      } else if (dto.contractAddress !== undefined) {
        contractAddress = dto.contractAddress;
      } else if (dto.contractName !== undefined) {
        const contract = this.rpcService.getContractAddress(dto.contractName);
        if (contract === undefined) {
          throw new Error('contract is not exitsed');
        }
        contractAddress = contract;
      }

      const args: ProcessContractDto = {
        network: dto.network,
        userAddress,
        contractAddress,
        function: dto.function,
        args: dto.args,
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
    // type: Boolean,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async submit(@Body() dto: SubmitContractDto): Promise<any> {
    try {
      // user
      let userAddress;
      if (dto.userAddress === undefined && dto.userName === undefined) {
        throw new Error('check user params');
      } else if (dto.userAddress !== undefined) {
        userAddress = dto.userAddress;
      } else if (dto.userName !== undefined) {
        const wallet = this.accountService.getWalletByName(dto.userName);
        if (wallet === undefined) {
          throw new Error('user is not existed');
        }
        userAddress = wallet.address;
      }
      // contract
      let contractAddress;
      if (dto.contractAddress === undefined && dto.contractName === undefined) {
        throw new Error('check contract params');
      } else if (dto.contractAddress !== undefined) {
        contractAddress = dto.contractAddress;
      } else if (dto.contractName !== undefined) {
        const contract = this.rpcService.getContractAddress(dto.contractName);
        if (contract === undefined) {
          throw new Error('contract is not existed');
        }
        contractAddress = contract;
      }

      const args: ProcessContractDto = {
        network: 'hardhat',
        userAddress,
        contractAddress,
        function: dto.function,
        args: dto.args,
      };

      const result = await this.commonService.submit(args);
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Post('submitWithETH')
  @Header('Content-Type', 'application/json')
  @ApiOperation({
    summary: 'Submit contract transaction',
    description: 'Submit transaction',
  })
  @ApiBody({ type: SubmitContractWithETHDto })
  @ApiCreatedResponse({
    description: 'Successfully submit transaction',
    // type: Boolean,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async submitWithETH(@Body() dto: SubmitContractWithETHDto): Promise<any> {
    try {
      // user
      let userAddress;
      if (dto.userAddress === undefined && dto.userName === undefined) {
        throw new Error('check user params');
      } else if (dto.userAddress !== undefined) {
        userAddress = dto.userAddress;
      } else if (dto.userName !== undefined) {
        const wallet = this.accountService.getWalletByName(dto.userName);
        if (wallet === undefined) {
          throw new Error('user is not existed');
        }
        userAddress = wallet.address;
      }
      // contract
      let contractAddress;
      if (dto.contractAddress === undefined && dto.contractName === undefined) {
        throw new Error('check contract params');
      } else if (dto.contractAddress !== undefined) {
        contractAddress = dto.contractAddress;
      } else if (dto.contractName !== undefined) {
        const contract = this.rpcService.getContractAddress(dto.contractName);
        if (contract === undefined) {
          throw new Error('contract is not existed');
        }
        contractAddress = contract;
      }

      const args: ProcessContractWithETHDto = {
        userAddress,
        contractAddress,
        function: dto.function,
        args: dto.args,
        eth: parseEther(dto.eth).toString(),
      };

      const result = await this.commonService.submitWithETH(args);
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
