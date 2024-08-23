import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { type ClientDto } from './dto/client.request';
import cacheService from '../../init/cache';

@Injectable()
export class AmoyClientService {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // account
    @Inject('AmoyAccount')
    private readonly accountService: AccountService,
  ) {}

  async getClient(dto: ClientDto): Promise<any> {
    return await this.accountService.getAccount(dto.userAddress);
  }

  getClientBalanceOf(dto: ClientDto): any {
    const data = cacheService.get(
      `network.${dto.network}.user.${dto.userAddress}.balancesOf`,
    );
    if (data === undefined) {
      throw new NotFoundException('pair not found');
    }
    return data;
  }
}
