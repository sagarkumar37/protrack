import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReportUrls } from '../enum/global-common';

@Injectable({
  providedIn: 'root'
})
export class RedashService {

  constructor(private http: HttpClient) { }

  refreshDashboard(payload: any):Observable<any> {
    let url= `${ReportUrls.redashDashboardUrl}/refresh-dashboard`;
    return this.http.post(url, payload).pipe(
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
