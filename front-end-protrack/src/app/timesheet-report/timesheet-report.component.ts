// timesheet-report.component.ts

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimesheetReportService } from '../timesheet-report.service';

@Component({
  selector: 'app-timesheet-report',
  templateUrl: './timesheet-report.component.html',
  styleUrls: ['./timesheet-report.component.css']
})
export class TimesheetReportComponent implements OnInit {
  // Date filter fields
  startDate: string | null = null;
  endDate: string | null = null;

  // Data for dropdowns
  employees: any[] = [];
  projects: any[] = [];
  activityTypes: any[] = [];
  availableDimensions = ['employee', 'project', 'activity_type', 'activity_name',  'day', 'description'];

  // Form controls for selected items
  selectedEmployeesControl = new FormControl([]);
  selectedProjectsControl = new FormControl([]);
  selectedActivityTypesControl = new FormControl([]);
  selectedDimensionsControl = new FormControl([]);

  // Report data
  reportData: any[] = [];
  tableHeaders: string[] = [];

  // Pagination fields
  totalCount = 0;
  totalPages = 0;
  currentPage = 1;
  limit = 100; // default records per page
  offset = 0; // computed as (currentPage - 1) * limit
  maxPageButtons = 5; // Maximum number of page buttons to show

  // Export loading state
  isExporting = false;

  // NEW: Role & Employee ID (from localStorage)
  userRole: string | null = null; 
  userEmployeeId: string | null = null;

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const max = this.maxPageButtons;
    const pages = [];

    let startPage = Math.max(1, current - Math.floor(max / 2));
    let endPage = Math.min(total, current + Math.floor(max / 2));

    if (endPage - startPage + 1 < max) {
      if (startPage === 1) {
        endPage = Math.min(total, startPage + max - 1);
      } else if (endPage === total) {
        startPage = Math.max(1, endPage - max + 1);
      }
    }

    // Add first page and ellipsis if starting beyond page 1
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(-1); // Ellipsis indicator
      }
    }

    // Add page numbers between startPage and endPage
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if ending before the last page
    if (endPage < total) {
      if (endPage + 1 < total) {
        pages.push(-1); // Ellipsis indicator
      }
      pages.push(total);
    }

    return pages;
  }

  constructor(private reportService: TimesheetReportService) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchFilterData();
  }

  /**
   * Fetch the user's role and employee ID from localStorage
   */
  fetchUserData(): void {
    try {
      const userDataString = localStorage.getItem('response');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        // Adjust the property access as needed based on your actual JSON structure
        this.userRole = userData?.employees?.role || null;
        this.userEmployeeId = userData?.employees?.id || null;
      }
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
    }
  }

  fetchFilterData(): void {
    this.reportService
      .getEmployees()
      .subscribe((data) => (this.employees = data));
    this.reportService
      .getProjects()
      .subscribe((data) => (this.projects = data));
    this.reportService
      .getActivityTypes()
      .subscribe((data) => (this.activityTypes = data));
  }

  // Utility method to display the first selected item in the mat-select trigger
  getFirstSelectedItemName(
    selectedValues: any[],
    type: 'employee' | 'project' | 'activity_type' | 'dimension'
  ): string {
    if (!selectedValues || !selectedValues.length) return '';

    if (type === 'employee') {
      const found = this.employees.find((e) => e.id === selectedValues[0]);
      return found ? found.name : '';
    } else if (type === 'project') {
      const found = this.projects.find((p) => p.proj_id === selectedValues[0]);
      return found ? found.proj_name : '';
    } else if (type === 'activity_type') {
      // In your code, the activity type is a simple string, so we return it directly
      return selectedValues[0];
    } else if (type === 'dimension') {
      return selectedValues[0];
    }
    return '';
  }

  private handleSelectAll(
    value: any[],
    allItems: any[],
    control: FormControl
  ) {
    if (value.includes('selectAll')) {
      const allSelected = value.length === allItems.length + 1;
      if (allSelected) {
        control.setValue([]);
      } else {
        control.setValue(allItems);
      }
    }
  }

  onEmployeesSelectionChange(event: any): void {
    const value = event.value || [];
    const allIds = this.employees.map((e) => e.id);
    this.handleSelectAll(value, allIds, this.selectedEmployeesControl);
    const cleaned = this.selectedEmployeesControl.value.filter(
      (v: any) => v !== 'selectAll'
    );
    this.selectedEmployeesControl.setValue(cleaned, { emitEvent: false });
  }

  onProjectsSelectionChange(event: any): void {
    const value = event.value || [];
    const allIds = this.projects.map((p) => p.proj_id);
    this.handleSelectAll(value, allIds, this.selectedProjectsControl);
    const cleaned = this.selectedProjectsControl.value.filter(
      (v: any) => v !== 'selectAll'
    );
    this.selectedProjectsControl.setValue(cleaned, { emitEvent: false });
  }

  onActivityTypesSelectionChange(event: any): void {
    const value = event.value || [];
    const allTypes = this.activityTypes.map((at) => at.activity_type);
    this.handleSelectAll(value, allTypes, this.selectedActivityTypesControl);
    const cleaned = this.selectedActivityTypesControl.value.filter(
      (v: any) => v !== 'selectAll'
    );
    this.selectedActivityTypesControl.setValue(cleaned, { emitEvent: false });
  }

  onDimensionsSelectionChange(event: any): void {
    const value = event.value || [];
    const allDims = [...this.availableDimensions];
    this.handleSelectAll(value, allDims, this.selectedDimensionsControl);
    const cleaned = this.selectedDimensionsControl.value.filter(
      (v: any) => v !== 'selectAll'
    );
    this.selectedDimensionsControl.setValue(cleaned, { emitEvent: false });
  }

  generateReport(): void {
    // Compute offset from currentPage and limit
    this.offset = (this.currentPage - 1) * this.limit;

    // By default, use the selected employees if any
    let selectedEmployeeIds = this.selectedEmployeesControl.value.length
      ? this.selectedEmployeesControl.value
      : null;

    // If the user is NOT admin, override employee_ids to current user's ID
    if (this.userRole !== 'admin' && this.userEmployeeId) {
      selectedEmployeeIds = [this.userEmployeeId];
    }

    const payload: any = {
      start_date: this.startDate || null,
      end_date: this.endDate || null,
      employee_ids: selectedEmployeeIds,
      project_ids: this.selectedProjectsControl.value.length
        ? this.selectedProjectsControl.value
        : null,
      activity_types: this.selectedActivityTypesControl.value.length
        ? this.selectedActivityTypesControl.value
        : null,
      aggregationDimensions: this.selectedDimensionsControl.value.length
        ? this.selectedDimensionsControl.value
        : [],
      limit: this.limit,
      offset: this.offset,
    };

    this.reportService.generateReport(payload).subscribe((data) => {
      // Data now expected as { totalCount, results }
      this.totalCount = data.totalCount;
      this.reportData = data.results;
      this.totalPages = Math.ceil(this.totalCount / this.limit);
      this.determineTableHeaders();
    });
  }

  determineTableHeaders(): void {
    if (!this.reportData.length) {
      this.tableHeaders = [];
      return;
    }
    const firstRow = this.reportData[0];
    this.tableHeaders = Object.keys(firstRow);
  }

  clearSelections(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedEmployeesControl.setValue([]);
    this.selectedProjectsControl.setValue([]);
    this.selectedActivityTypesControl.setValue([]);
    this.selectedDimensionsControl.setValue([]);
    this.reportData = [];
    this.tableHeaders = [];
    this.totalCount = 0;
    this.totalPages = 0;
    this.currentPage = 1;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber < 1) return;
    if (pageNumber > this.totalPages) return;
    this.currentPage = pageNumber;
    this.generateReport();
  }

  changeLimit(): void {
    // When limit changes, reset to the first page
    this.currentPage = 1;
    this.generateReport();
  }

  exportToExcel(): void {
    this.isExporting = true; // Set exporting state to true
    // Again, override employee_ids for non-admin users
    let selectedEmployeeIds = this.selectedEmployeesControl.value.length
      ? this.selectedEmployeesControl.value
      : null;
    if (this.userRole !== 'admin' && this.userEmployeeId) {
      selectedEmployeeIds = [this.userEmployeeId];
    }

    const payload: any = {
      start_date: this.startDate || null,
      end_date: this.endDate || null,
      employee_ids: selectedEmployeeIds,
      project_ids: this.selectedProjectsControl.value.length
        ? this.selectedProjectsControl.value
        : null,
      activity_types: this.selectedActivityTypesControl.value.length
        ? this.selectedActivityTypesControl.value
        : null,
      aggregationDimensions: this.selectedDimensionsControl.value.length
        ? this.selectedDimensionsControl.value
        : [],
      exportType: 'excel', // Indicate a full export
      limit: null, // No pagination for export
      offset: null,
    };

    this.reportService.exportReportToExcel(payload).subscribe(
      (blob: Blob) => {
        // Create a link to download the blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.xlsx'; // Name of the file
        a.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false; // Reset exporting state
      },
      (error) => {
        // Handle error
        console.error('Export failed', error);
        this.isExporting = false; // Reset exporting state in case of error
      }
    );
  }
}
