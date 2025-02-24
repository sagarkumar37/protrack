import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {MatTabsModule} from '@angular/material/tabs';
import{MatButtonModule} from '@angular/material/button';

import { MatToolbarModule } from '@angular/material/toolbar'



import { MatTableModule } from '@angular/material/table';

import { LogoutComponent } from './logout/logout.component';
import {  MatTooltipModule } from '@angular/material/tooltip';

import { MatIconModule } from '@angular/material/icon';
import { TestLoginComponent } from './test-login/test-login.component';
import { DashbComponent } from './dashb/dashb.component';
import { TestDashboardComponent } from './test-dashboard/test-dashboard.component';
import { AttendComponent } from './attend/attend.component';

import { ToastrModule } from 'ngx-toastr';



import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from './table/table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { TaskProgressComponent } from './task-progress/task-progress.component';
import { EmployeeLogsComponent } from './employee-logs/employee-logs.component';
import { ReportTableComponent } from './report-table/report-table.component';

import { MatTableExporterModule } from 'mat-table-exporter';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';
import { WeeklyPlanComponent } from './weekly-plan/weekly-plan.component';
import { ConfirmDialogBoxComponent } from './weekly-report/confirm-dialog-box/confirm-dialog-box.component';
import { WeekReportComponent } from './week-report/week-report.component';
import { LineBreakPipe } from './week-report/line-break.pipe';

import { MatCardModule} from '@angular/material/card';
import { ViewWeekReportComponent } from './view-week-report/view-week-report.component';
import { InsertWeekReportComponent } from './insert-week-report/insert-week-report.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { DateFormatPipe } from './admin-report/date-format.pipe';
import {NextWeekDateFormatPipe} from './week-report/next-week.pipe'
import { DatePipe } from '@angular/common';
// import { PlanComponent } from './weekplan/weekplan.component';





@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    TestLoginComponent,
    DashbComponent,
    TestDashboardComponent,
    AttendComponent,
    TableComponent,
    TaskProgressComponent,
    EmployeeLogsComponent,
    ReportTableComponent,
    WeeklyReportComponent,
    WeeklyPlanComponent,
    ConfirmDialogBoxComponent,
    WeekReportComponent,
    LineBreakPipe,
    NextWeekDateFormatPipe,
    ViewWeekReportComponent,
    InsertWeekReportComponent,
    AdminReportComponent,
    DateFormatPipe,
    // PlanComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,  
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatTableExporterModule,
    MatCardModule    
  ],
  // schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
  