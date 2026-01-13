import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


interface ReportResponse {
  totalCount: number;
  results: any[];
}

@Injectable({
  providedIn: 'root'
})


export class TimesheetReportService {

  constructor(private http: HttpClient) {}

  getEmployees() {
    return this.http.get<any[]>(`${environment.API_BASE_URL}/api/employees`);
  }

  getProjects() {
    return this.http.get<any[]>(`${environment.API_BASE_URL}/api/projects`);
  }

  getActivityTypes() {
    return this.http.get<any[]>(`${environment.API_BASE_URL}/api/activity-types`);
  }

  generateReport(payload: {
    start_date?: string | null,
    end_date?: string | null,
    employee_ids?: number[] | null,
    project_ids?: number[] | null,
    activity_types?: string[] | null,
    aggregationDimensions?: string[] | null,
    limit?: number,
    offset?: number
  }): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(`${environment.API_BASE_URL}/api/timesheet-report`, payload);
  }


  exportReportToExcel(payload: any): Observable<Blob> {
    return this.http.post(`${environment.API_BASE_URL}/api/timesheet-report`, payload, {
      responseType: 'blob'
    }) as Observable<Blob>;
  }

}
