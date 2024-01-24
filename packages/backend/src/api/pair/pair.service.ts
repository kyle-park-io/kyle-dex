import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RpcService } from '../../blockChain/rpc/interfaces/rpc.interface';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { CommonService } from '../../blockChain/common/common.service';
// dto
import { type GetReserveDto } from './dto/pair.request';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';
import { ZeroAddress } from 'ethers';

@Injectable()
export class PairService {
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

  async getReserve(dto: GetReserveDto): Promise<any> {
    try {
      const queryDto: ProcessContractDto = {
        userAddress: ZeroAddress,
        contractAddress: dto.pairAddress,
        function: 'GetReserve',
        args: [],
      };
      await this.commonService.query(queryDto);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
