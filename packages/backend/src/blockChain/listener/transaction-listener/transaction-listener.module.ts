import { Module } from '@nestjs/common';
import { HardhatTransactionListenerService } from './transaction-listener.hardhat.service';
import { SepoliaTransactionListenerService } from './transaction-listener.sepolia.service';
import { AmoyTransactionListenerService } from './transaction-listener.amoy.service';
import { EventEmitterModule } from '../../../event-emitter/event-emitter.module';

@Module({
  imports: [EventEmitterModule],
  providers: [
    {
      provide: 'HardhatTransactionListener',
      useClass: HardhatTransactionListenerService,
    },
    {
      provide: 'SepoliaTransactionListener',
      useClass: SepoliaTransactionListenerService,
    },
    {
      provide: 'AmoyTransactionListener',
      useClass: AmoyTransactionListenerService,
    },
  ],
  exports: [
    'HardhatTransactionListener',
    'SepoliaTransactionListener',
    'AmoyTransactionListener',
  ],
})
export class TransactionListenerModule {}
