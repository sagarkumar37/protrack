import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRegularizationService {

  constructor(private http: HttpClient) { }

  fetchRegularizationRequest(id: string | null): Observable<any> {
    let url= `${environment.API_BASE_URL}/checkRegularizationRequestValid?req_id=${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  approveRegularization(payload: any):Observable<any> {
    let url= `${environment.API_BASE_URL}/updateAttendanceRegularizationRequest`;
    return this.http.post(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  rejectRegularization(payload: any): Observable<any> {
    const url = `${environment.API_BASE_URL}/updateAttendanceRegularizationRequest`;
    return this.http.post(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  getAttendanceRegularizationRequestList(hodId: any, date: any): Observable<any>{
    const url = `${environment.API_BASE_URL}/getAttendanceRegularizationRequest?hodId=${hodId}&requestDate=${date}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
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
