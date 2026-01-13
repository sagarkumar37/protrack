import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendComponent } from './attend.component';

const routes: Routes = [
  {
    path: '',
    component: AttendComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendRoutingModule { }
