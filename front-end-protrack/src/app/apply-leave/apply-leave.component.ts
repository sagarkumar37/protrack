import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../services/leave/leave.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LeaveDetailDialogComponent } from '../leave-detail-dialog/leave-detail-dialog.component';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
})
export class ApplyLeaveComponent implements OnInit {
  isAdmin: boolean = false;
  employeeId: string | null = null;
  employeeList: any[] = [];
  selectedEmployeeId: number | null = null;

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
    'from_date_leave_duration',
    'to_date_leave_duration'
  ]; // Table columns

  leaveForm = {
    employee_id: '',
    from_date: '',
    to_date: '',
    leave_type_id: '',
    reason: '',
    from_date_leave_duration: '',
    to_date_leave_duration: '',
    leave_days: 0,
    half_day_type: '',
  };
  appliedLeaves: any[] = [];
  role: string;
  isData: boolean= false;
  isLoading: boolean= true;
  leaveTypes: any[] = [];
  user: any;
  selectedEmployeeEmail: any;
  selectedLeaveType: any;

  constructor(private leaveService: LeaveService, private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    let employees: any = JSON.parse(localStorage.getItem('response') || '{}');
    console.log("employees.employees", employees.employees, "response::", employees);

    this.user = employees.employees;
    
    this.employeeId= employees.employees.id;
    this.isAdmin= employees.employees.role === 'admin';
    if(this.isAdmin){
      this.fetchAllEmployees();
    }
    if (!this.isAdmin && this.employeeId) {
      this.leaveForm.employee_id = this.employeeId;
    }
    this.fetchAppliedLeaves();
  }

  ngOnInit(): void {
    this.fetchLeaveTypes(this.employeeId);
  }

  fetchLeaveTypes(emp_id: any){
    this.leaveService.getLeaveTypesBalance(emp_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.leaveTypes = response.data;
        }
        else {
          console.error('Failed to fetch leave types and balance:', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching leave types and balance:', err);
      },
    });
  }

  fetchAllEmployees(): void {
    this.leaveService.getAllEmployees().subscribe(
      (res) => (this.employeeList = res),
      (err) => console.error(err)
    );
  }

  fetchAppliedLeaves(): void {
    this.leaveService.getAllLeaves(this.employeeId).subscribe((res: any) => {
      this.appliedLeaves = res.leaves;
      this.isData = res.leaves.length > 0;
      this.isLoading = false;
    },
      (err) => {
         console.error(err)
         this.isLoading = false;
      }
    );
  }

  onEmployeeSelected(){
    const selectedEmployee = this.employeeList.find(emp => emp.id == this.selectedEmployeeId);
    if (selectedEmployee) {
      this.selectedEmployeeEmail= selectedEmployee.email_id;
      console.log('Selected Employee Email:', selectedEmployee.email_id);  
      this.fetchLeaveTypes(selectedEmployee.id)
    }
  }

  updateTotalLeaveDays() {
    const fromDuration = parseFloat(this.leaveForm.from_date_leave_duration) || 0;
    const toDuration = parseFloat(this.leaveForm.to_date_leave_duration) || 0;
  
    const fromDate = new Date(this.leaveForm.from_date);
    const toDate = new Date(this.leaveForm.to_date);
  
    if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      this.leaveForm.leave_days = 0;
      return;
    }
  
    const dateDiff = Math.floor(
      (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  
    const middleDays = dateDiff > 1 ? (dateDiff - 1) : 0;
  
    this.leaveForm.leave_days = fromDuration + middleDays + toDuration;
  }

  onFromDateLeaveDurationChange() {
    this.updateTotalLeaveDays();
  }

  onToDateLeaveDurationChange() {
    this.updateTotalLeaveDays();
  }  

  onLeaveTypeChange(event: any): void {
    console.log('Selected Leave Type:', this.selectedLeaveType);
  }

  submitLeave(): void {

    this.updateTotalLeaveDays();

    if (!this.validateLeaveForm()) {
      return;
    }

    if (this.isAdmin && !this.selectedEmployeeId) {
      alert('Please select an employee');
      return;
    }
    const datePipe = new DatePipe('en-US');
    this.leaveForm.from_date = datePipe.transform(this.leaveForm.from_date, 'yyyy-MM-dd') || '';
    this.leaveForm.to_date = datePipe.transform(this.leaveForm.to_date, 'yyyy-MM-dd') || '';
    this.leaveForm.leave_type_id= this.selectedLeaveType.leave_type_id;

    const leaveData = {
      ...this.leaveForm,
      employee_id: this.isAdmin ? this.selectedEmployeeId : this.employeeId,
      departmentId: !this.isAdmin ? this.user.department : '',
      emp_email: this.isAdmin ? this.selectedEmployeeEmail : this.user.email_id,
    };


    // const leaveData = {
    //   ...this.leaveForm,
    //   employee_id: this.isAdmin ? this.selectedEmployeeId : this.employeeId,
    //   departmentId: !this.isAdmin ? this.user.department : '',
    //   emp_email: this.isAdmin ? this.selectedEmployeeEmail : this.user.email_id
    // };

    if(!this.isAdmin){
      console.log("leaveData:", leaveData);
      this.leaveService.createLeaveForEmp(leaveData).subscribe(
        () => {
          this.toastr.success("Leave applied successfully!");
          this.leaveForm = {
            employee_id: '',
            from_date: '',
            to_date: '',
            leave_type_id: '',
            reason: '',
            from_date_leave_duration: '',
            to_date_leave_duration: '',
            leave_days: 0,
            half_day_type: '',
          };
          this.selectedEmployeeId= null;
          this.selectedLeaveType= '';
          this.fetchAppliedLeaves();
        },
        (err: any) => {
          console.error(err)
          this.toastr.error(err.error.message);
        }
      );
    }
    else if(this.isAdmin){
      this.leaveService.createLeaveForAdmin(leaveData).subscribe(
        () => {
          this.leaveForm = {
            employee_id: '',
            from_date: '',
            to_date: '',
            leave_type_id: '',
            reason: '',
            from_date_leave_duration: '',
            to_date_leave_duration: '',
            leave_days: 0,
            half_day_type: '',
          };
          this.toastr.success("Leave applied successfully!");
          this.selectedEmployeeId= null;
          this.selectedLeaveType= '';
          this.fetchAppliedLeaves();
        },
        (err: any) =>{
           console.error(err)
           this.toastr.error(err.error.message);
        }
      );
    }
  }

  deleteLeave(id: number) {
    console.log("delete id:::", id);
    
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leaveService.deleteLeaveRequest(id).subscribe({
        next: () => {
          this.toastr.success('Leave request deleted successfully.');
          // Optionally refresh data:
          this.fetchAppliedLeaves(); // Replace with your data reload method
        },
        error: () => {
          this.toastr.error('Failed to delete leave request.');
        }
      });
    }
  }

  openLeaveDetail(record: any) {
    this.dialog.open(LeaveDetailDialogComponent, {
      width: '75%',
      position: { left: '20%' },
      data: record
    });
  }

  validateLeaveForm(): boolean {
    if (!this.leaveForm.from_date || !this.leaveForm.to_date || !this.leaveForm.from_date_leave_duration || !this.leaveForm.to_date_leave_duration) {
      this.toastr.error('Please fill all required fields.');
      return false;
    }
    return true;
  }

  // Reset form
  resetForm() {
    this.leaveForm = {
    employee_id: '',
    from_date: '',
    to_date: '',
    leave_type_id: '',
    reason: '',
    from_date_leave_duration: '',
    to_date_leave_duration: '',
    leave_days: 0,
    half_day_type: '',
    };
  }
}
