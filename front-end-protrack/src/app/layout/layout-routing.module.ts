import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared/auth.guard';
import { GlobalReportComponent } from '../global-report/global-report.component';
import { MyReportComponent } from '../my-report/my-report.component';

const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashb/dashb.module').then(
            (m) => m.DashbModule
          ),canActivate:[AuthGuard]
      },
      {
        path: 'attendance',
        loadChildren: () =>
          import('../attend/attend.module').then(
            (m) => m.AttendModule
          ),canActivate:[AuthGuard]
      },

      {
        path: 'timesheet-report',
        loadChildren: () => 
          import('../timesheet-report/timesheet-report.module').then(m => m.TimesheetReportModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'timesheet',
        loadChildren: () => 
          import('../logout/logout.module').then(m => m.LogoutModule),
          canActivate: [AuthGuard]
      },

      {
        path: 'attendance-log',
        loadChildren: () => 
          import('../employee-attendance-log/employee-attendance-log.module').then(m => m.EmployeeAttendanceLogModule),
          canActivate: [AuthGuard]
      },

      {
        path: 'regularized-requested',
        loadChildren: () => 
          import('../regularized-list/regularized-list.module').then(m => m.RegularizedListModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'admin-management',
        loadChildren: () => 
          import('../admin-management/admin-management.module').then(m => m.AdminManagementModule),
          canActivate: [AuthGuard]
      },

      {
        path: 'apply-leave',
        loadChildren: () => 
          import('../apply-leave/apply-leave.module').then(m => m.ApplyLeaveModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'leave-requested',
        loadChildren: () => 
          import('../hod-approve-leave/hod-approve-leave.module').then(m => m.HodApproveLeaveModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'weekly-report',
        loadChildren: () => 
          import('../weekly-report/weekly-report.module').then(m => m.WeeklyReportModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'view-week-report',
        loadChildren: () => 
          import('../week-report/week-report.module').then(m => m.WeekReportModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'global-report',
        component: GlobalReportComponent
      },
      {
        path: 'my-report',
        component: MyReportComponent
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
