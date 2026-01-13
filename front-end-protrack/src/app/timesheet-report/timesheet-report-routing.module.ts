import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetReportComponent } from './timesheet-report.component';

const routes: Routes = [
  {
    path: '',
    component: TimesheetReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetReportRoutingModule { }
