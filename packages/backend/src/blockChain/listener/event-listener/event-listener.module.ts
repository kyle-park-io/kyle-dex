import { Module, Global } from '@nestjs/common';
import { HardhatEventListenerService } from './event-listener.hardhat.service';
import { SepoliaEventListenerService } from './event-listener.sepolia.service';
import { AmoyEventListenerService } from './event-listener.amoy.service';
import { EventEmitterModule } from '../../../event-emitter/event-emitter.module';

@Global()
@Module({
  imports: [EventEmitterModule],
  providers: [
    { provide: 'HardhatEventListener', useClass: HardhatEventListenerService },
    { provide: 'SepoliaEventListener', useClass: SepoliaEventListenerService },
    { provide: 'AmoyEventListener', useClass: AmoyEventListenerService },
  ],
  exports: [
    'HardhatEventListener',
    'SepoliaEventListener',
    'AmoyEventListener',
  ],
})
export class EventListenerModule {}
