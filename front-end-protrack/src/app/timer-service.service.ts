import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer$: Observable<number>;
  private timerSubject = new Subject<number>();
  private timerId: any;
  private startTime: number;

  constructor() {
    this.timer$ = this.timerSubject.asObservable();
  }

  startTimer(): void {
    this.startTime = Date.now();
    this.timerId = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.timerSubject.next(elapsedTime);
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.timerId);
    this.timerSubject.next(0);
  }

  getTimer(): Observable<number> {
    return this.timer$;
  }
}
