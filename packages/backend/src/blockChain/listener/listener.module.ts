import { Module } from '@nestjs/common';
import { TransactionListenerModule } from './transaction-listener/transaction-listener.module';
import { EventListenerModule } from './event-listener/event-listener.module';

@Module({
  imports: [EventListenerModule, TransactionListenerModule],
})
export class ListenerModule {}
