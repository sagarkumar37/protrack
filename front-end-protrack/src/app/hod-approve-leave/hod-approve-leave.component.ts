import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveService } from '../services/leave/leave.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hod-approve-leave',
  templateUrl: './hod-approve-leave.component.html',
  styleUrls: ['./hod-approve-leave.component.css'],
})
export class HodApproveLeaveComponent implements OnInit {
  leaveId: any;
  leaveDetails: any = null;
  hodComment: string = '';
  decision: 'Approved' | 'Rejected' | null = null;
  isLeaveStatus: any;
  leaveReason: any;
  isLeavePopupOpen: boolean= false;

  displayedColumns: string[] = [
    'from_date',
    'to_date',
    'request_date',
    'status',
    'reason',
    'hod_comments',
    'added_by_admin',
    'leave_type',
    'hod_email',  
    'emp_emailId',
    'actions'  
  ]; // Table columns

  isData: boolean= false;
  isLoading: boolean= true;

  appliedLeaves: any[] = [];
  user: any;
  reqId: any;
  isHod: any;

  constructor(
    private route: ActivatedRoute,
    private leaveService: LeaveService,
    private toastr: ToastrService
  ) {

    const json: string | null = localStorage.getItem('response');
    if (json) {
      try {
        this.user = JSON.parse(json).employees;
        this.isHod= JSON.parse(json).isHod;
      } catch (err) {
        console.error('Error parsing user data from localStorage', err);
        this.toastr.error('Error loading user data.');
      }
    }
    
    this.route.queryParams.subscribe(params => {
      this.reqId = params['req_id']; 
      console.log('Request ID:', this.reqId);
      if(this.reqId){
        this.fetchLeaveDetails(this.reqId);
      }
    });
  }

  ngOnInit(): void {
    this.reqId = Number(this.route.snapshot.queryParamMap.get('leave-approval'));
    console.log("reqId:", this.reqId);
    if (this.reqId) {
      this.fetchLeaveDetails(this.reqId);
      this.isLeavePopupOpen = true;
    }
    this.fetchRequestedLeaves();
  }

  isApprovedRejected(status: any){
    if(status === 'Pending'){
      return status;
    }
  }

  fetchRequestedLeaves(): void {
    if(this.isHod){
      this.leaveService.fetchLeaveRequests(this.isHod.hod_id).subscribe((res: any) => {
        this.appliedLeaves = res.resp_data;
        this.isData = res.resp_data.length > 0;
        this.isLoading = false;
      },
        (err) => {
          console.error(err)
          this.isLoading = false;
        }
      );
    }
  }

  fetchLeaveDetails(reqId: number): void {
    this.leaveService.getLeaveDetails(reqId).subscribe(
      (res) => {
        this.isLoading = false;
        this.leaveDetails = res;
        console.log("res.length::", res);
        if(res){
          // this.isData= true 
          this.isLeavePopupOpen = true;
               }
        this.leaveId= res.id;
        console.log('Leave Details:', this.leaveDetails);
      },
      (err) => {
        if (err.status === 403) {
          this.isLeaveStatus= err.error.leaveStatus;
          console.error('Leave Status:', err.error.message);
        } else if (err.status === 404) {
          console.error('Leave not found:', err.error.message);
        } else {
          console.error('Error fetching leave details:', err);
        }
      }
    );
  }
  

  submitDecision(decision: any): void {
    if (!decision) {
      this.toastr.warning('Please select a decision');
      return;
    }
    this.leaveService
      .updateLeaveStatus(this.leaveId!, decision, this.hodComment)
      .subscribe(
        () => {
          this.toastr.success(`Leave ${decision.toLowerCase()} successfully!`)
          this.closePopup();
          this.fetchRequestedLeaves();
        },
        (err) => {
           console.error(err)
           this.toastr.error(err.message)
        }
      );
  }

  openLeavePopup(record: any): void {
    if (!record) {
      this.toastr.warning('No record selected for leave');
      return;
    }
    this.isLeavePopupOpen = true;
    this.fetchLeaveDetails(record.req_id);
  }

  closePopup(): void {
    this.isLeavePopupOpen = false;
    this.hodComment = '';
  }
}
