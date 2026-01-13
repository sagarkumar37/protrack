import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-detail-dialog',
  templateUrl: './leave-detail-dialog.component.html',
  styleUrls: ['./leave-detail-dialog.component.css']
})
export class LeaveDetailDialogComponent implements OnInit {

  displayedColumns: string[] = ['from', 'to', 'type', 'status', 'reason', 'request_date', 'leave_days',     'hod_comments',
    'added_by_admin',
    'hod_email', 
    'hod_comments'];

  dataSource: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = [data]; // wrap single object into array for mat-table
    console.log("dataSource:::", this.dataSource);
    
  }

  ngOnInit(): void {
  }

}
