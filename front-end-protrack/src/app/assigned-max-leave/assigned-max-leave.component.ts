import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LeaveService } from '../services/leave/leave.service';

@Component({
  selector: 'app-assigned-max-leave',
  templateUrl: './assigned-max-leave.component.html',
  styleUrls: ['./assigned-max-leave.component.css']
})
export class AssignedMaxLeaveComponent implements OnInit {

  @ViewChild('assignedLeaveForm') assignedLeaveForm!: NgForm;

  successMessage: string = '';

  selectedEmployeeId!: number;
  selectedLeaveType!: number;
  maxLeaves: number = 0;

  employeeList: any[] = [];
  leaveTypes: any[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.fetchAllEmployees();
    // this.fetchLeaveTypes();
  }

  fetchLeaveTypes(employee_id: any) {
    this.leaveService.getLeaveTypesBalance(employee_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.leaveTypes = response.data;
        } else {
          console.error('Failed to fetch leave types:', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching leave types:', err);
      },
    });
  }

  onEmployeeSelected(){
    const selectedEmployee = this.employeeList.find(emp => emp.id == this.selectedEmployeeId);
    if (selectedEmployee) {
      this.fetchLeaveTypes(selectedEmployee.id)
    }
  }

  fetchAllEmployees(): void {
    this.leaveService.getAllEmployees().subscribe(
      (res) => (this.employeeList = res),
      (err) => console.error(err)
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const assignedLeaveData = {
        employee_id: this.selectedEmployeeId,
        leave_type_id: this.selectedLeaveType,
        max_leaves: this.maxLeaves
      };

      this.leaveService.addAssignedLeave(assignedLeaveData).subscribe(
        (response) => {
          this.successMessage = 'Leave assigned successfully!';
          form.reset(); // Reset form after submission
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  preventE(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }
  
}
