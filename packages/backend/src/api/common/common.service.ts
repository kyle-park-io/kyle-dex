import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService as BlockChainCommonService } from 'src/blockChain/common/common.service';
import {
  type QueryContract,
  type SubmitContractTransaction,
} from './dto/common.request';

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

  async query(queryContract: QueryContract): Promise<any> {
    try {
      const result = await this.blockChainCommonService.query(
        queryContract.address,
        queryContract.function,
        queryContract.args,
      );
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async submit(
    submitContractTransaction: SubmitContractTransaction,
  ): Promise<void> {
    try {
      await this.blockChainCommonService.submit(
        submitContractTransaction.address,
        submitContractTransaction.function,
        submitContractTransaction.args,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
