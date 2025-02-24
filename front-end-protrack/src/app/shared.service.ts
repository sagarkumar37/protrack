import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private yearWeek: number;

  setYearWeek(yearWeek: number) {
    this.yearWeek = yearWeek;
  }

  getYearWeek(): number {
    return this.yearWeek;
  }
}
