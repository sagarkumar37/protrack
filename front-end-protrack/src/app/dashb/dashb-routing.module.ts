import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbComponent } from './dashb.component';

const routes: Routes = [
  {
    path: '',
    component: DashbComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashbRoutingModule { }
