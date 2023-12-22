import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService } from 'src/blockChain/common/common.service';
import { AccountService } from 'src/blockChain/account/interfaces/account.interface';
import { ContractService } from 'src/blockChain/contract/contract.service';
import { type CalcPairDto } from './dto/utils.request.dto';
import { type ResponsePairDto } from './dto/utils.response.dto';
import { type ProcessContractDto } from 'src/blockChain/common/dto/common.dto';

@Injectable()
export class UtilsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
    private readonly contractService: ContractService,
  ) {}

  async calcPair(dto: CalcPairDto): Promise<ResponsePairDto> {
    try {
      const contractAddress: string | undefined =
        this.contractService.getContractAddress(dto.name);
      if (contractAddress === undefined) {
        throw new Error('contract is not existed');
      }

      const args: ProcessContractDto = {
        userAddress: dto.userAddress,
        contractAddress,
        function: 'calcPair',
        args: [dto.factory, dto.tokenA, dto.tokenB],
      };
      const address = await this.commonService.query(args);

      // const name = this.contractService.getContractName(address.result);
      // if (name === undefined) {
      //   throw new Error('pair contract is not existed');
      // }
      const name = 'pair';
      const result: ResponsePairDto = { name, address: address.result };
      return result;
    } catch (err) {
      this.logger.error('calcPair error');
      throw err;
    }
  }
}
