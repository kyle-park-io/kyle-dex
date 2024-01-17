import { Module } from '@nestjs/common';
import { HardhatClientService } from './client.hardhat.service';
import { SepoliaClientService } from './client.sepolia.service';
import { MumbaiClientService } from './client.mumbai.service';
import { ClientController } from './client.controller';
import { HardhatRpcService } from '../../blockChain/rpc/rpc.hardhat.service';
import { SepoliaRpcService } from '../../blockChain/rpc/rpc.sepolia.service';
import { MumbaiRpcService } from '../../blockChain/rpc/rpc.mumbai.service';
import { HardhatAccountService } from '../../blockChain/account/account.hardhat.service';
import { SepoliaAccountService } from '../../blockChain/account/account.sepolia.service';
import { MumbaiAccountService } from '../../blockChain/account/account.mumbai.service';

@Module({
  controllers: [ClientController],
  providers: [
    { provide: 'HardhatRpc', useClass: HardhatRpcService },
    { provide: 'SepoliaRpc', useClass: SepoliaRpcService },
    { provide: 'MumbaiRpc', useClass: MumbaiRpcService },
    { provide: 'HardhatAccount', useClass: HardhatAccountService },
    { provide: 'SepoliaAccount', useClass: SepoliaAccountService },
    { provide: 'MumbaiAccount', useClass: MumbaiAccountService },
    HardhatClientService,
    SepoliaClientService,
    MumbaiClientService,
  ],
})
export class ClientModule {}
