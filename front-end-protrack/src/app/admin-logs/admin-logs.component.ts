import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input'; 
import { EmpLogsService } from '../emp-logs.service';

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css'],
})

export class AdminLogsComponent {
  selectDate: string ; 
  timeTrackingRecords: any[] = [];
  viewReport=false;

  constructor(private timeTrackingService: EmpLogsService) { }

//   onDateSelected() {
//     const formattedDate = this.formatDate(this.selectDate);
    
//     this.timeTrackingService.getLoginLogs(formattedDate).subscribe((data: any) => {
//       this.timeTrackingRecords = data;
//     });
//   }
//   private formatDate(date: Date): string {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${year}/${month}/${day}`;
//   }
fetchReport() {
  if (this.selectDate) {
    this.viewReport=true;
    // Call the service to fetch the report based on the selected date
    this.timeTrackingService.getLoginLogs(this.selectDate).subscribe(
      (data) => {
        this.timeTrackingRecords = data; // Update the records with the fetched data
      },
      (error) => {
        console.error('Error fetching report:', error);
      }
    );
  }
}

}
