import { Module } from '@nestjs/common';
import { RpcModule } from '../../../blockChain/rpc/rpc.module';
import { EventEmitterModule } from '../../../event-emitter/event-emitter.module';

@Module({
  imports: [RpcModule, EventEmitterModule],
})
export class EventListenerModule {}
