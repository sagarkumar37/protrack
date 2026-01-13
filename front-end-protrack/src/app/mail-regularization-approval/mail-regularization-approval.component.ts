import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendanceRegularizationService } from '../services/attendance-regularization.service';

@Component({
  selector: 'app-mail-regularization-approval',
  templateUrl: './mail-regularization-approval.component.html',
  styleUrls: ['./mail-regularization-approval.component.css']
})
export class MailRegularizationApprovalComponent implements OnInit {

  regularizationRequest: any;
  reqId: any;
  isAlreadyApproved: boolean= true;
  regularizationReason: any;

  constructor(private route: ActivatedRoute,
    private http: HttpClient, 
    private toastr: ToastrService,
    private attendanceRegularization: AttendanceRegularizationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.reqId = params['req_id']; 
      console.log('Request ID:', this.reqId);
      this.fetchRegularizationRequest(this.reqId);
    });
  }

  fetchRegularizationRequest(id: string | null) {
    this.attendanceRegularization.fetchRegularizationRequest(id).subscribe({
      next: (response: any) => {
        if(response.resp_code == 200){
          this.regularizationRequest = response.requestRegularizationInfo;
          this.isAlreadyApproved= false;
        }
        else if(response.resp_code == 201){
          this.isAlreadyApproved= true;
        }
      },
      error: (err: any) => {
        this.handleError(err);
        console.log("err::", err);        
      }
    });
  }

  approveRegularization(action: string) {
    const id = this.regularizationRequest.id;
    let payload= {
      id: id,
      isApproved: action,
      hodFeedback: this.regularizationReason
    }
    this.attendanceRegularization.approveRegularization(payload).subscribe({
      next: () => {
        this.isAlreadyApproved= true;
        alert('Request approved successfully!');
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  rejectRegularization(action: string) {
    const id = this.regularizationRequest.id;
    let payload= {
      id: id,
      isApproved: action,
      hodFeedback: this.regularizationReason
    }
    this.attendanceRegularization.rejectRegularization(payload).subscribe({
      next: () => {
        this.isAlreadyApproved= true;
        alert('Request rejected successfully!');
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleError(error: any) {
    const errorMessage = error.message ? error.message : 'An unknown error occurred!';
    // alert(`Error: ${errorMessage}`);
  }

}
