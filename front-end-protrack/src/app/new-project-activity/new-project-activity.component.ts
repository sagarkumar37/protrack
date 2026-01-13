import { Component, OnInit } from '@angular/core';
import { AdminManagementService } from '../services/admin-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-project-activity',
  templateUrl: './new-project-activity.component.html',
  styleUrls: ['./new-project-activity.component.css']
})
export class NewProjectActivityComponent implements OnInit {
  projectForm: FormGroup;
  activityForm: FormGroup;
  projects: any[] = [];
  selectedProject: any = null;
  currentProject: any = null;
  errorMessage: string = '';
  successMessage: string = '';
  isNewProject: boolean = false;
  projectSubmitted: boolean = false;
  activitiesWithTypes: any[] = [];

  customers = [];


  constructor(
    private fb: FormBuilder,
    private adminService: AdminManagementService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForms();
    this.loadProjects();
    this.getAllActivitiesTypes();
    this.getCustomers();
  }

  createForms(): void {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      billingType: [null, Validators.required],
      nonBillableType: [null], // Will add conditional validation
      customerCode: [null, Validators.required]

    });

    this.activityForm = this.fb.group({
      selectedActivity: [null, Validators.required],
      useful: [false]
    });
  }

  toggleProjectMode(): void {
    this.isNewProject = !this.isNewProject;
    this.currentProject = null;
    this.projectSubmitted = false;
    if (this.isNewProject) {
      this.projectForm.reset();
    } else {
      this.selectedProject = null;
    }
  }

  loadProjects(): void {
    this.adminService.getProject().subscribe(
      (res) => {
        this.projects = res.projects || [];
      },
      (err) => {
        console.error('Error fetching projects:', err);
        this.toastService.error('Failed to load projects', 'Error');
      }
    );
  }

  getAllActivitiesTypes() {
    this.adminService.getActivitiesTypes().subscribe(
      (res) => {
        this.activitiesWithTypes = res.results || [];
      },
      (error) => {
        console.error('Error fetching activities:', error);
        this.toastService.error('Failed to load activities', 'Error');
      }
    );
  }

  getCustomers(){
    this.adminService.getAllCustomers().subscribe(
      (res: any) => {
        this.customers= res;
      },
      (error: any) => {
        console.error('Error fetching all Customers:', error);
        this.toastService.error('Failed to load customer list', 'Error');      
      }
    )
  }

  addProject(): void {
    this.projectSubmitted = true;
    
    if (this.projectForm.invalid) {
      return;
    }

    const payload = {
      projectName: this.projectForm.value.projectName,
      description: this.projectForm.value.description,
      billingType: this.projectForm.value.billingType,
      nonBillableType: this.projectForm.value.nonBillableType,
      customerCode: this.projectForm.value.customerCode
    };


    this.adminService.addProject(payload).subscribe(
      (res: any) => {
        if (res.message === 'Project added successfully') {
          this.toastService.success(res.message);
          this.currentProject = res.newProject;
          this.loadProjects();
          this.projectForm.reset();
          this.isNewProject = false;
          this.successMessage = `Project "${res.newProject.proj_name}" created successfully!`;
          setTimeout(() => this.successMessage = '', 5000);
        } else if (res.error) {
          this.errorMessage = res.error;
          this.toastService.error(res.error);
        }
      },
      (err) => {
        console.error('Error adding project:', err);
        this.errorMessage = 'Failed to create project. Please try again.';
        this.toastService.error('Failed to create project', 'Error');
      }
    );
  }

  onProjectSelect(projectId: any): void {
    this.projectSubmitted = true;
    if (!projectId) return;
    
    this.currentProject = this.projects.find(p => p.proj_id === projectId.proj_id);
    this.successMessage = `Project "${this.currentProject.proj_name}" selected`;
    setTimeout(() => this.successMessage = '', 3000);
  }

  addActivity(): void {
    if (!this.currentProject) {
      this.errorMessage = 'Please select or create a project first';
      this.toastService.error(this.errorMessage);
      return;
    }

    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const selectedActivity = this.activityForm.value.selectedActivity;
    const useful = this.activityForm.value.useful;

    const payload = {
      activity_name: `${this.currentProject.proj_name}: ${selectedActivity.name}`,
      proj_id: this.currentProject.proj_id,
      useful: useful,
      activity_type: selectedActivity.type_name
    };

    this.adminService.addActivity(payload).subscribe(
      (res) => {
        if (res.message === 'Activity added successfully') {
          this.toastService.success(res.message);
          this.activityForm.reset({ useful: false });
          this.successMessage = `Activity "${selectedActivity.name}" added to project`;
          setTimeout(() => this.successMessage = '', 5000);
        } else if (res.error === 'activity name already exist') {
          this.errorMessage = 'This activity already exists for the selected project';
          this.toastService.error(this.errorMessage);
        }
      },
      (err) => {
        console.log('Error adding activity:', err);
        this.errorMessage = err?.error?.error || 'Failed to add activity. Please try again.';
        this.toastService.error(this.errorMessage);
      }
    );
  }

  updateProject(): void {
  if (!this.currentProject) return;

  const payload = {
    projectId: this.currentProject.proj_id,
    billingType: this.projectForm.value.billingType,
    nonBillableType: this.projectForm.value.nonBillableType,
    customerCode: this.projectForm.value.customerCode
  };

  this.adminService.updateProject(payload).subscribe(
    (res: any) => {
      if (res.message === 'Project updated successfully') {
        this.toastService.success(res.message);
        this.currentProject = res.updatedProject;
        this.loadProjects();
      } else {
        this.toastService.error(res.error);
      }
    },
    (err: any) => this.toastService.error('Failed to update project')
  );
}

}