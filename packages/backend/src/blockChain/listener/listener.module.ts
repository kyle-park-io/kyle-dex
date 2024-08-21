import { Module } from '@nestjs/common';
import { EventListenerModule } from './event-listener/event-listener.module';
import { TransactionListenerModule } from './transaction-listener/transaction-listener.module';

@Module({
  imports: [EventListenerModule, TransactionListenerModule],
  exports: [EventListenerModule, TransactionListenerModule],
})
export class ListenerModule {}
