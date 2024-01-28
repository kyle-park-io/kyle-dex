import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  AccountService,
  type AccountAddress,
} from '../../blockChain/account/interfaces/account.interface';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type ClientDto } from './dto/client.request';

@Injectable()
export class HardhatClientService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // account
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
  ) {}

  getClientList(): AccountAddress[] {
    return this.accountService.getAccountList();
  }

  async getClient(dto: ClientDto): Promise<any> {
    return await this.accountService.getAccount(dto.userAddress);
  }
}
