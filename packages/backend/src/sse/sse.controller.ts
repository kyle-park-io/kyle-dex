import { Controller, Sse, type MessageEvent } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('test')
  sse(): Observable<MessageEvent> {
    return this.sseService.getEventObservable();
  }
}
