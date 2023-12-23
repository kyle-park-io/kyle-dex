import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService } from '../../blockChain/common/common.service';
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
    private readonly contractService: ContractService,
  ) {}

  async balanceOf(dto: BalanceOfDto): Promise<ResponseBalanceOfDto> {
    try {
      let contractAddress: string | undefined;
      if (dto.contractAddress === undefined) {
        contractAddress = this.contractService.getContractAddress(dto.name);
      } else {
        contractAddress = dto.contractAddress;
      }
      if (contractAddress === undefined) {
        throw new Error('contract is not existed');
      }

      const args: ProcessContractDto = {
        userAddress: dto.userAddress,
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
