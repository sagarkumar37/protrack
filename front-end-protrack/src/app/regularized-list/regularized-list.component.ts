import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AttendanceRegularizationService } from '../services/attendance-regularization.service';

@Component({
  selector: 'app-regularized-list',
  templateUrl: './regularized-list.component.html',
  styleUrls: ['./regularized-list.component.css'],
})
export class RegularizedListComponent implements OnInit {
  selectedDate: Date = new Date();
  attendanceRecords = new MatTableDataSource<any>(); // Material Table Data Source
  displayedColumns: string[] = [
    'start_time',
    'end_time',
    'hours',
    'weekend',
    'date',
    'requestDate',
    'empEmail',
    'Status',
    'reason',
    'actions',
  ]; // Table columns
  isRegularizationPopupOpen = false;
  selectedRecord: any = null;
  regularizationReason: string = '';
  requestPunchOutTime: any;
  requestPunchInTime: any;
  user: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isHod: any;
  regularizationRequest: any;
  isAlreadyApproved: boolean = true;
  isLoading: boolean= true;
  isData: boolean= false;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private attendanceRegularization: AttendanceRegularizationService
  ) {
    let response: any | null = localStorage.getItem('response');
    response = JSON.parse(response);
    if (response) {
      try {
      this.user = response.employees;
      this.isHod = response.isHod ? response.isHod.hod_id : null;
      }catch (err){
        console.error('Error parsing user data from localStorage', err);
        this.toastr.error('Error loading user data.');
      }
    }
  }

  ngOnInit(): void {
    this.fetchAttendanceRecords();
  }

  fetchAttendanceRecords(): void {
    if (!this.selectedDate) {
      this.toastr.warning('Please select a valid date to fetch records.');
      return;
    }
    let date= this.selectedDate.toISOString().split('T')[0];

    this.attendanceRegularization
      .getAttendanceRegularizationRequestList(this.isHod, date)
      .subscribe({
        next: (response: any) => {
          if (
            response &&
            response.resp_data.length > 0 &&
            response.resp_status == true
          ) {       
            this.isData= true;   
            this.attendanceRecords.data = response.resp_data;            
            this.isLoading= false;
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
    this.fetchRegularizationRequest(record.req_id);
  }

  // Close the regularization popup
  closeRegularizationPopup(): void {
    this.isRegularizationPopupOpen = false;
    this.selectedRecord = null;
    this.regularizationReason = '';
  }

  cleanForm(): void {
    this.selectedRecord = null;
    this.regularizationReason = '';
  }

  fetchRegularizationRequest(id: string | null) {
    this.attendanceRegularization.fetchRegularizationRequest(id).subscribe({
      next: (response: any) => {
        if (response.resp_code == 200) {
          this.attendanceRecords.data=[];
          this.regularizationRequest = response.requestRegularizationInfo;
          this.isAlreadyApproved = false;
        } else if (response.resp_code == 201) {
          this.isAlreadyApproved = true;
          this.attendanceRecords.data=[];
          this.fetchAttendanceRecords();
        }
      },
      error: (err: any) => {
        this.handleError(err);
      },
    });
  }

  approveRegularization(action: string) {
    const id = this.regularizationRequest.id;
    let payload = {
      id: id,
      isApproved: action,
      hodFeedback: this.regularizationReason,
    };
    this.attendanceRegularization.approveRegularization(payload).subscribe({
      next: () => {
        this.closeRegularizationPopup();
        this.fetchAttendanceRecords();
        alert('Request approved successfully!');
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  rejectRegularization(action: string) {
    const id = this.regularizationRequest.id;
    let payload = {
      id: id,
      isApproved: action,
      hodFeedback: this.regularizationReason,
    };
    this.attendanceRegularization.rejectRegularization(payload).subscribe({
      next: () => {
        this.closeRegularizationPopup();
        this.fetchAttendanceRecords();
        alert('Request rejected successfully!');
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  private handleError(error: any) {
    const errorMessage = error.message
      ? error.message
      : 'An unknown error occurred!';
    alert(`Error: ${errorMessage}`);
  }
}
