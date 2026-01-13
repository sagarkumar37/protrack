import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklyReportComponent } from './weekly-report.component';

const routes: Routes = [
  {
    path: '',
    component: WeeklyReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeeklyReportRoutingModule { }
