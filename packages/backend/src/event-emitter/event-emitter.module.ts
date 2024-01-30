import { Module } from '@nestjs/common';
import { EventEmitterService } from './event-emitter.service';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [SseModule],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventEmitterModule {}
