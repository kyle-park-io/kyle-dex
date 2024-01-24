import { Module } from '@nestjs/common';
import { PairService } from './pair.service';
import { PairController } from './pair.controller';
import { HardhatRpcService } from '../../blockChain/rpc/rpc.hardhat.service';
import { SepoliaRpcService } from '../../blockChain/rpc/rpc.sepolia.service';
import { MumbaiRpcService } from '../../blockChain/rpc/rpc.mumbai.service';
import { HardhatAccountService } from '../../blockChain/account/account.hardhat.service';
import { SepoliaAccountService } from '../../blockChain/account/account.sepolia.service';
import { MumbaiAccountService } from '../../blockChain/account/account.mumbai.service';

@Module({
  controllers: [PairController],
  providers: [
    { provide: 'HardhatRpc', useClass: HardhatRpcService },
    { provide: 'SepoliaRpc', useClass: SepoliaRpcService },
    { provide: 'MumbaiRpc', useClass: MumbaiRpcService },
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
    { provide: 'SepoliaAccount', useClass: SepoliaAccountService },
    { provide: 'MumbaiAccount', useClass: MumbaiAccountService },
    PairService,
  ],
})
export class PairModule {}
