import {
  Inject,
  Injectable,
  LoggerService,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RpcService } from '../../../blockChain/rpc/interfaces/rpc.interface';
import { type Provider } from 'ethers';

@Injectable()
export class TransactionListenerService implements OnModuleInit {
  constructor(
    // config
    private readonly configService: ConfigService,
    // logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // rpc
    @Inject('SepoliaRpc') private readonly rpcService: RpcService,
  ) {}

  async onModuleInit(): Promise<void> {
    const provider: Provider = this.rpcService.getProvider();
    const blockNumber = await provider.getBlockNumber();

    // while (blockNumber > 0) {
    //   const block = await provider.getBlock(blockNumber, true);
    //   // console.log(block);
    //   // console.log(block?.prefetchedTransactions);

    //   // for (const transaction of block.transactions) {
    //   //   if (transaction.to === toAddress) {
    //   //     console.log(
    //   //       `Transaction found in block ${blockNumber}:`,
    //   //       transaction,
    //   //     );
    //   //   }
    //   // }

    //   // blockNumber--;
    // }

    // console.log(this.rpcService.getRpc());
  }
}
