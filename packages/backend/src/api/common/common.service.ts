import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService as BlockChainCommonService } from '../../blockChain/common/common.service';
import {
  type ProcessContractDto,
  type ProcessContractWithETHDto,
} from '../../blockChain/common/dto/common.dto';
import { isError } from 'ethers';
import { CustomError } from '../../common/error/custom.error';

@Injectable()
export class CommonService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // extra
    private readonly blockChainCommonService: BlockChainCommonService,
  ) {}

  async query(dto: ProcessContractDto): Promise<any> {
    try {
      const result = await this.blockChainCommonService.query(dto);
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async submit(dto: ProcessContractDto): Promise<any> {
    try {
      const result = await this.blockChainCommonService.submit(dto);
      return result;
    } catch (err) {
      if (isError(err, 'CALL_EXCEPTION')) {
        this.logger.error(err);
        // throw err;
        const errObj = new CustomError(err.code, err.reason, err.shortMessage);
        throw errObj;
      }
    }
  }

  async submitWithETH(dto: ProcessContractWithETHDto): Promise<any> {
    try {
      const result = await this.blockChainCommonService.submitWithETH(dto);
      return result;
    } catch (err) {
      if (isError(err, 'CALL_EXCEPTION')) {
        this.logger.error(err);
        // throw err;
        const errObj = new CustomError(err.code, err.reason, err.shortMessage);
        throw errObj;
      }
    }
  }
}
