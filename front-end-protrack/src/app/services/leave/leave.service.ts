import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private baseUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  getLeaveTypesBalance(employee_id: any): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/leave-types-and-balance/${employee_id}`);
  }

  getLeaveTypes(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/leave-types`);
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employees`);
  }

  getAllLeaves(emp_id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/leaves?employee_id=${emp_id}`);
  }

  getLeaveDetails(leaveId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/leave/${leaveId}`);
  }  

  createLeaveForEmp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/empApplyLeave`, data);
  }

  createLeaveForAdmin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/adminAddLeave`, data);
  }

  updateLeaveStatus(id: number, status: string, hodComments: string = ''): Observable<any> {
    return this.http.patch(`${this.baseUrl}/hodApproveLeave/${id}`, { status, hod_comments: hodComments });
  }

  deleteLeaveRequest(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/leave/${id}`);
  }
  

  fetchLeaveRequests(hod_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/leave-requests?hodId=${hod_id}`)
  }

  addAssignedLeave(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/assigned-max-leave`, data);
  }
}
