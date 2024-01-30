import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SseService } from '../sse/sse.service';

@Injectable()
export class EventEmitterService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly sseService: SseService,
  ) {}

  @OnEvent('PairCreated')
  get(data: any): void {
    this.sseService.triggerEvent(data);
  }

  create(event: string, data: any): void {
    this.eventEmitter.emit(event, data);
  }
}
