import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AdminManagementService } from '../services/admin-management.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-hod-management',
  templateUrl: './hod-management.component.html',
  styleUrls: ['./hod-management.component.css']
})
export class HodManagementComponent implements OnInit {

  departments= new MatTableDataSource<any>(); ;
  employees: any[] = [];
  editIndex: number | null = null;
  displayedColumns: string[] = ['department_name', 'hod', 'actions'];
  departmentName: any;
  hodId: any;
  isDepartmentPopupOpen: boolean= false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminService: AdminManagementService,
     private toastrService: ToastrService,
    private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments(): void {
    this.adminService.getDepartments().subscribe({
      next: (data: any) => {
        if (data) {
          this.departments = data.departments;
          this.employees = data.employees;
          console.log("Received departments:", this.departments);
  
          if (this.departments && this.paginator) {
            this.departments.paginator = this.paginator;
            console.log("Paginator assigned:", this.departments.paginator);
          } else {
            console.warn("Either departments or paginator is undefined");
          }
  
          // Force change detection
          this.changeDetectorRef.detectChanges();
  
          // Log paginator state
          console.log("Current paginator state:", this.paginator);
        }
      },
      error: (error: any) => {
        console.error('Error fetching department and hod:', error);
      }
    });
  }  

  edit(department: any): void {
    this.editIndex = department.department_id;
  }

  save(department: any): void {

    let payload= {
      departmentName: department.department_name,
      depID: department.department_id,
      newHod: department.hod_id
    }
    this.adminService.updateHod(payload).subscribe((result: any) => {
      if(result.success == true){
        this.editIndex = null;
        this.toastrService.success(result.message)
        this.fetchDepartments();
      }else{
        this.toastrService.error(result.message)
      }
    }, (error: any) => {
      console.error('Error updating hod:', error);
    }
  );
  }

  deleteHod(departmentId: number): void {
    this.adminService.deleteHod(departmentId).subscribe(
      (result: any) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.fetchDepartments();
        } else {
          this.toastrService.error(result.message);
        }
      },
      (error: any) => {
        console.error('Error deleting HoD:', error);
        this.toastrService.error('Failed to delete HoD');
      }
    );
  }
  

  openCreateDialog(): void {
    this.isDepartmentPopupOpen= true;
  }

  closeDepartmentPopup(){
    this.isDepartmentPopupOpen= false;
  }

  createDepartment() {

    if(!this.departmentName && !this.hodId){
      this.toastrService.error('Please enter required field')
      return
    }
    let payload= {
      departmentName: this.departmentName,
      hodId: this.hodId
    }
    this.adminService.createDepartment(payload).subscribe((result: any) => {
      if(result.success == true){
        this.editIndex = null;
        this.toastrService.success(result.message)
        this.departmentName= '';
        this.hodId= '';
        this.fetchDepartments();
        this.closeDepartmentPopup()
      }else{
        this.toastrService.error(result.message)
      }
      console.log('Department created');
    }, (error: any) => {
      console.error('Error creating hod:', error);
    });
  }
}