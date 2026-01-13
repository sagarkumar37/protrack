import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAttendanceLogComponent } from './employee-attendance-log.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeAttendanceLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAttendanceLogRoutingModule { }
