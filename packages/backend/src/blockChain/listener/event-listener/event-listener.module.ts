import { Module } from '@nestjs/common';
import { HardhatEventListenerService } from './event-listener.hardhat.service';
import { RpcModule } from '../../../blockChain/rpc/rpc.module';
import { EventEmitterModule } from '../../../event-emitter/event-emitter.module';

@Module({
  imports: [RpcModule, EventEmitterModule],
  providers: [
    { provide: 'HardhatEvent', useClass: HardhatEventListenerService },
  ],
})
export class EventListenerModule {}
