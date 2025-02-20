import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) {
      return '';
    }

    const year = Math.floor(value / 100);
    const week = value % 100;
    const startDate = moment().year(year).week(week).startOf('isoWeek').format('YYYY/MM/DD');
    const endDate = moment().year(year).week(week).endOf('isoWeek').format('YYYY/MM/DD');

    return `${startDate} - ${endDate}`;
  }

}
