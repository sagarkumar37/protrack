import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegularizedListComponent } from './regularized-list.component';

const routes: Routes = [
  {
    path: '',
    component: RegularizedListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegularizedListRoutingModule { }
