import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService } from '../../blockChain/common/common.service';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { ContractService } from '../../blockChain/contract/contract.service';
import { type BalanceOfDto } from './dto/token.request.dto';
import { type ResponseBalanceOfDto } from './dto/token.response.dto';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';

@Injectable()
export class TokenService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    private readonly contractService: ContractService,
  ) {}

  async balanceOf(dto: BalanceOfDto): Promise<ResponseBalanceOfDto> {
    try {
      // user
      let userAddress;
      if (dto.userAddress === undefined && dto.userName === undefined) {
        throw new Error('chekc user params');
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
        const contract = this.contractService.getContractAddress(
          dto.contractName,
        );
        if (contract === undefined) {
          throw new Error('contract is not existed');
        }
        contractAddress = contract;
      }

      const args: ProcessContractDto = {
        userAddress,
        contractAddress,
        function: 'balanceOf',
        args: [dto.address],
      };
      const balance = await this.commonService.query(args);
      const result: ResponseBalanceOfDto = { amount: balance.result };
      return result;
    } catch (err) {
      this.logger.error('balanceOf error');
      throw err;
    }
  }
}
