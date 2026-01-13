import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-attendance-log',
  templateUrl: './employee-attendance-log.component.html',
  styleUrls: ['./employee-attendance-log.component.css'],
})
export class EmployeeAttendanceLogComponent implements OnInit {
  selectedDate: Date = new Date();
  attendanceRecords = new MatTableDataSource<any>(); // Material Table Data Source
  displayedColumns: string[] = [
    'date',
    'start_time',
    'end_time',
    'hours',
    'weekend',
    'on_leave',
    'holiday',
    'punch_in_location_name',
    'punch_out_location_name',
    'actions'
  ]; // Table columns
  isRegularizationPopupOpen = false;
  selectedRecord: any = null;
  regularizationReason: string = '';
  requestPunchOutTime: any;
  requestPunchInTime: any;
  user: any;
  isLoading= true;
  currentDate: Date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    const json: string | null = localStorage.getItem('response');
    if (json) {
      try {
        this.user = JSON.parse(json).employees;
      } catch (err) {
        console.error('Error parsing user data from localStorage', err);
        this.toastr.error('Error loading user data.');
      }
    }
    this.fetchAttendanceRecords();
  }

  getLeaveStatus(onLeaveValue: number): string {
    switch(onLeaveValue) {
      case 1: return 'Full Day Leave';
      case 2: return 'First Half Day';
      case 3: return 'Second Half Day';
      case 4: return '1/4 Day Leave';
      case 5: return '3/4 Day Leave';
      default: return 'No Leave';
    }
  }

  isFutureDate(date: string): boolean {
    console.log("currentDate:", this.currentDate); 
    const currentDate=  this.currentDate.toLocaleDateString('en-CA');   
    console.log("new Date(date):", new Date(date));
    return new Date(date) > this.currentDate;
  }

  fetchAttendanceRecords(): void {
    if (!this.selectedDate) {
      this.toastr.warning('Please select a valid date to fetch records.');
      return;
    }

    let payload = {
      date: this.selectedDate.toISOString().split('T')[0],
    };

    this.http
      .post<any[]>(`${environment.API_BASE_URL}/attendanceDetails`, payload)
      .subscribe({
        next: (response: any) => {
          if (response && response.data.length > 0) {
            this.isLoading= false;
            this.attendanceRecords.data = response.data;
            setTimeout(() => {    
              this.isLoading= false;         
              if (this.attendanceRecords && this.paginator) {
                this.attendanceRecords.paginator = this.paginator;
              }
            }, 1000);
          } else {
            setTimeout(() => {    
              this.isLoading= false;         
              if (this.attendanceRecords && this.paginator) {
                this.attendanceRecords.paginator = this.paginator;
              }
            }, 1000);
            this.toastr.info(
              'No attendance records found for the selected date.'
            );
          }
        },
        error: (err) => {
          setTimeout(() => {    
            this.isLoading= false;         
            if (this.attendanceRecords && this.paginator) {
              this.attendanceRecords.paginator = this.paginator;
            }
          }, 1000);
          console.error('Error fetching attendance records:', err);
          this.toastr.error(
            'Failed to fetch attendance records. Please try again later.'
          );
        },
      });
  }

  // Open the regularization popup with the selected record
  openRegularizationPopup(record: any): void {
    if (!record) {
      this.toastr.warning('No record selected for regularization.');
      return;
    }
    this.selectedRecord = record;
    this.isRegularizationPopupOpen = true;
  }

  // Close the regularization popup
  closeRegularizationPopup(): void {
    this.isRegularizationPopupOpen = false;
    this.selectedRecord = null;
    this.regularizationReason = '';
    this.requestPunchInTime = null;
    this.requestPunchOutTime = null;
  }

  submitRegularizationRequest(): void {
    if (
      !this.selectedRecord ||
      !this.regularizationReason ||
      !this.requestPunchInTime ||
      !this.requestPunchOutTime
    ) {
      this.toastr.warning('Please fill out all the required fields.');
      return;
    }

    const requestBody = {
      empId: this.selectedRecord.employeecode,
      date: this.selectedRecord.date,
      reason: this.regularizationReason,
      departmentId: this.user.department,
      requestPunchInTime: this.requestPunchInTime,
      requestPunchOutTime: this.requestPunchOutTime,
      requestedEmailId: this.user.email_id,
    };

    this.http.post(`${environment.API_BASE_URL}/attendanceRegularizationRequest`, requestBody)
      .subscribe({
        next: (response: any) => {
          console.log('Regularization request submitted successfully:', response);
          if(response.resp_code == 200){
            this.toastr.success('Regularization request submitted successfully.');
            this.cleanForm();
            this.closeRegularizationPopup();
          }else{            
            this.toastr.error(response.resp_data);
            this.cleanForm();
            this.closeRegularizationPopup();
          }
        },
        error: (err) => {
          console.error('Error submitting regularization request:', err);
          this.toastr.error(
            'Unable to submit regularization request. Please try again.'
          );
        },
      });
  }

  cleanForm(): void {
    this.selectedRecord = null;
    this.regularizationReason = '';
    this.requestPunchInTime = null;
    this.requestPunchOutTime = null;
  }
}
