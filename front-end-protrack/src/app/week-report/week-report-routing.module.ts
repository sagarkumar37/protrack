import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeekReportComponent } from './week-report.component';

const routes: Routes = [
  {
    path: '',
    component: WeekReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekReportRoutingModule { }
