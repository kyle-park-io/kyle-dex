import { Injectable, type MessageEvent } from '@nestjs/common';
import { type Observable, Subject, interval, map } from 'rxjs';

@Injectable()
export class SseService {
  private readonly eventSubject = new Subject<any>();

  getEventObservable(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
    // return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }

  triggerEvent(data: any): void {
    this.eventSubject.next(data);
  }
}
