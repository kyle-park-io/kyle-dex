import { Module } from '@nestjs/common';
import { TransactionListenerModule } from './transaction-listener/transaction-listener.module';
import { EventListenerModule } from './event-listener/event-listener.module';
import { HardhatEventListenerService } from './event-listener/event-listener.hardhat.service';

@Module({
  imports: [EventListenerModule, TransactionListenerModule],
  providers: [
    { provide: 'HardhatEventListener', useClass: HardhatEventListenerService },
  ],
  exports: ['HardhatEventListener'],
})
export class ListenerModule {}
