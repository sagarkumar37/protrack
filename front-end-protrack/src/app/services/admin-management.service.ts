import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {

  constructor(private http: HttpClient) { }

  addHoliday(holiday: any) : Observable<any>{
    let url= `${environment.API_BASE_URL}/addHoliday`
    return this.http.post(url, holiday).pipe(
      catchError(this.handleError)
    );
  }

  getHoliday() : Observable<any>{
    let url= `${environment.API_BASE_URL}/getHoliday`
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  addProject(project: any) : Observable<any>{
    let url= `${environment.API_BASE_URL}/addProject`
    return this.http.post(url, project).pipe(catchError(this.handleError))
  }

  updateProject(project: any) : Observable<any>{
    let url= `${environment.API_BASE_URL}/updateProject`
    return this.http.post(url, project).pipe(catchError(this.handleError))
  }

  getProject(): Observable<any>{
    let url= `${environment.API_BASE_URL}/getProject`
    return this.http.get(url).pipe(catchError(this.handleError))
  }

  getActivitiesTypes(): Observable<any>{
    let url= `${environment.API_BASE_URL}/getAllActivitiesWithTypes`
    return this.http.get(url).pipe(catchError(this.handleError))
  }

  getAllCustomers(){
    let url= `${environment.API_BASE_URL}/getCustomers`
    return this.http.get(url).pipe(catchError(this.handleError))
  }

  addActivity(payload: {
    activity_name: string,
    proj_id: number,
    useful: boolean,
    activity_type: string
  }): Observable<any> {
    const url = `${environment.API_BASE_URL}/addActivity`;
    return this.http.post(url, payload).pipe(
      catchError(this.handleError)
    );
  }


  getDepartments(): Observable<any> {
      let url= `${environment.API_BASE_URL}/departments`
    return this.http.get(`${url}`).pipe(catchError(this.handleError));
  }

  updateHod(updateHod: any): Observable<any> {
    let url= `${environment.API_BASE_URL}/updateHod`
    return this.http.put(`${url}`, updateHod).pipe(catchError(this.handleError));
  }

  createDepartment(createDepartment: any): Observable<any> {
    let url= `${environment.API_BASE_URL}/createDepartment`
    return this.http.post(url, createDepartment).pipe(catchError(this.handleError))
  }

  deleteHod(departmentId: number): Observable<any> {
    return this.http.delete(`${environment.API_BASE_URL}/api/hod/${departmentId}`).pipe(catchError(this.handleError));
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Return observable with error message
  }
  
}
