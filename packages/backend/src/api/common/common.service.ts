import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService as BlockChainCommonService } from '../../blockChain/common/common.service';
import {
  type ProcessContractDto,
  type ProcessContractWithETHDto,
} from '../../blockChain/common/dto/common.dto';

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

  async submit(dto: ProcessContractDto): Promise<void> {
    try {
      await this.blockChainCommonService.submit(dto);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async submitWithETH(dto: ProcessContractWithETHDto): Promise<void> {
    try {
      await this.blockChainCommonService.submitWithETH(dto);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
