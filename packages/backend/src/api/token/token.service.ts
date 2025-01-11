import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommonService } from '../../blockChain/common/common.service';
import { AccountService } from '../../blockChain/account/interfaces/account.interface';
import { RpcService } from '../../blockChain/rpc/interfaces/rpc.interface';
import { type BalanceOfDto } from './dto/token.request.dto';
import { type ResponseBalanceOfDto } from './dto/token.response.dto';
import { type ProcessContractDto } from '../../blockChain/common/dto/common.dto';
import { NetworkType } from '../network/dto/network.request';
import { type TokenContractType } from '../../blockChain/rpc/types/types';
import { ZeroAddress } from 'ethers';

@Injectable()
export class TokenService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
    @Inject('HardhatAccount')
    private readonly accountService: AccountService,
    @Inject('HardhatRpc')
    private readonly hardhatRpcService: RpcService,
    @Inject('SepoliaRpc')
    private readonly sepoliaRpcService: RpcService,
    @Inject('AmoyRpc')
    private readonly amoyRpcService: RpcService,
  ) {}

  async balanceOf(dto: BalanceOfDto): Promise<ResponseBalanceOfDto> {
    try {
      // // user
      // let userAddress;
      // if (dto.userAddress === undefined && dto.userName === undefined) {
      //   throw new Error('chekc user params');
      // } else if (dto.userAddress !== undefined) {
      //   userAddress = dto.userAddress;
      // } else if (dto.userName !== undefined) {
      //   const wallet = this.accountService.getWalletByName(dto.userName);
      //   if (wallet === undefined) {
      //     throw new Error('user is not existed');
      //   }
      //   userAddress = wallet.address;
      // }
      // if (dto.userName !== undefined && dto.userAddress !== undefined) {
      //   const address = this.accountService.getAddressByName(dto.userName);
      //   if (dto.userAddress !== address) {
      //     throw new Error('user name is unmatched by user address');
      //   }
      // }

      // contract
      let contractAddress;
      if (dto.contractAddress === undefined && dto.contractName === undefined) {
        throw new Error('check contract params');
      } else if (dto.contractAddress !== undefined) {
        contractAddress = dto.contractAddress;
      } else if (dto.contractName !== undefined) {
        let contract;
        switch (dto.network) {
          case NetworkType.hardhat: {
            contract = this.hardhatRpcService.getContractAddress(
              dto.contractName,
            );
            break;
          }
          case NetworkType.sepolia: {
            contract = this.sepoliaRpcService.getContractAddress(
              dto.contractName,
            );
            break;
          }
          case NetworkType.amoy: {
            contract = this.amoyRpcService.getContractAddress(dto.contractName);
            break;
          }
        }
        if (contract === undefined) {
          throw new Error('contract is not existed');
        }
        contractAddress = contract;
      }

      const args: ProcessContractDto = {
        network: dto.network,
        // userAddress,
        userAddress: ZeroAddress,
        contractAddress,
        function: 'balanceOf',
        args: [dto.address],
      };
      return await this.commonService.query(args);
    } catch (err) {
      this.logger.error('balanceOf error');
      throw err;
    }
  }

  async getTokenContractList(network: NetworkType): Promise<any> {
    try {
      let list: TokenContractType[] | null = null;
      switch (network) {
        case NetworkType.hardhat:
          list = this.hardhatRpcService.getTokenContractList();
          break;
        case NetworkType.sepolia:
          list = this.sepoliaRpcService.getTokenContractList();
          break;
        case NetworkType.amoy:
          list = this.amoyRpcService.getTokenContractList();
          break;
      }
      if (list === null) {
        throw new NotFoundException('token contract list not found');
      }
      return list;
    } catch (err) {
      this.logger.error('getTokenContractList error');
      throw err;
    }
  }
}
