import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { HardhatRpcService } from '../../blockChain/rpc/rpc.hardhat.service';
import { HardhatAccountService } from '../../blockChain/account/account.hardhat.service';

@Module({
  controllers: [TokenController],
  providers: [
    { provide: 'HardhatRpc', useClass: HardhatRpcService },
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
    TokenService,
  ],
})
export class TokenModule {}
