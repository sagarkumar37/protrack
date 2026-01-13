import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HodApproveLeaveComponent } from './hod-approve-leave.component';

const routes: Routes = [
  {
    path: '',
    component: HodApproveLeaveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HodApproveLeaveRoutingModule { }
