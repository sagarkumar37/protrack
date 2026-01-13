
import { NgModule} from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LogoutComponent } from './logout/logout.component';

import { TestLoginComponent } from './test-login/test-login.component';

import { TestDashboardComponent } from './test-dashboard/test-dashboard.component';

import { DashbComponent } from './dashb/dashb.component';
import  {AuthGuard} from './shared/auth.guard';
import { Auth2Guard } from './shared/auth2.guard';
import { TableComponent } from './table/table.component';


import { EmployeeLogsComponent } from './employee-logs/employee-logs.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';
import { WeeklyPlanComponent } from './weekly-plan/weekly-plan.component';
import { WeekReportComponent } from './week-report/week-report.component';
import { ViewWeekReportComponent } from './view-week-report/view-week-report.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import {AdminLogsComponent} from './admin-logs/admin-logs.component';
import { MailRegularizationApprovalComponent } from './mail-regularization-approval/mail-regularization-approval.component';
import { HodApproveLeaveComponent } from './hod-approve-leave/hod-approve-leave.component';

// import { PlanComponent } from './weekplan/weekplan.component';
// self code

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {
      path: 'main',
      loadChildren: () =>
        import('./layout/layout.module').then((m) => m.LayoutModule),
      canActivate:[AuthGuard]
  },
  // { path: '**', redirectTo: 'login' },

  {path: "logout",component:LogoutComponent,canActivate:[AuthGuard]},
  {path:"login",component:TestLoginComponent},
  // {path:"dashboard",component:TestDashboardComponent,canActivate:[AuthGuard]},
  {path:"dashb",component:DashbComponent,canActivate:[AuthGuard]},
  {path:"employee-logs", component: EmployeeLogsComponent,canActivate:[AuthGuard]},
  {path:"report-table", component:ReportTableComponent,canActivate:[AuthGuard]},
  {path:"weekly-report", component: WeeklyReportComponent,canActivate:[AuthGuard]},
  {path:"weekly-plan", component: WeeklyPlanComponent,canActivate:[AuthGuard]},
  {path:"week-report", component: WeekReportComponent,canActivate:[AuthGuard]},
  {path:"view-week-report", component: ViewWeekReportComponent,canActivate:[AuthGuard]},
  {path:"admin-report",component: AdminReportComponent,canActivate:[Auth2Guard]},
  {path:"admin-logs",component: AdminLogsComponent},
  {path: 'attendance-regularization', component: MailRegularizationApprovalComponent},
  {path: 'leave-approval', component: HodApproveLeaveComponent}
  // {path:"weekplan",component:PlanComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
