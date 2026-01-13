import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetFlagService {

  // private apiUrl = "http://localhost:3000/timesheetflag"
  private apiEndpoint  = '/timesheetflag';

  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor(private http:HttpClient) { }

  getTimesheetFlag(headers:any): Observable<any>{

    return this.http.get(`${this.apiUrl}`,{headers})

  }

  getTimeSheetAsPerDate(selectedDate: any){
    let apiUrl= `${environment.API_BASE_URL}/getTimeSheetAtDate`;
    return this.http.post(apiUrl, selectedDate)
  }

}
