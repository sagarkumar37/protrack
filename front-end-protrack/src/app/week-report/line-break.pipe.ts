// line-break.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreak'
})
export class LineBreakPipe implements PipeTransform {
  transform(value: string): string {
    // Replace '\n' and '.' with '<br>' to break lines
    return value.replace(/(\n|\.)+/g, '<br>');
  }
}
