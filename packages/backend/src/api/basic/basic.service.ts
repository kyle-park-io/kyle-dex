import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RpcService } from '../../blockChain/rpc/interfaces/rpc.interface';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { CommonService } from '../../blockChain/common/common.service';

@Injectable()
export class BasicService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // rpc
    @Inject('HardhatRpc')
    private readonly rpcService: RpcService,
    // account
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    // extra
    private readonly commonService: CommonService,
  ) {}

  async A(dto: any): Promise<any> {
    try {
      return '';
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
