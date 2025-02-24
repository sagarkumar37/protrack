import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'nextWeekDateRange'
})
export class NextWeekDateFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) {
      return '';
    }

    const year = Math.floor(value / 100);
    const week = value % 100;
    const nextWeekStartDate = moment().year(year).week(week).add(1, 'weeks').startOf('isoWeek').format('YYYY/MM/DD');
    const nextWeekEndDate = moment().year(year).week(week).add(1, 'weeks').endOf('isoWeek').format('YYYY/MM/DD');

    return `${nextWeekStartDate} - ${nextWeekEndDate}`;
  }

}
