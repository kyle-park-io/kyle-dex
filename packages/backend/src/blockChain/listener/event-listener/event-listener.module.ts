import { Module } from '@nestjs/common';
import { HardhatEventListenerService } from './event-listener.hardhat.service';
import { RpcModule } from '../../../blockChain/rpc/rpc.module';

@Module({
  imports: [RpcModule],
  providers: [
    { provide: 'HardhatEvent', useClass: HardhatEventListenerService },
  ],
})
export class EventListenerModule {}
