import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TotalTimeTrackedService {

  // private apiUrl   = 'http://localhost:3000/duration'
  private apiEndpoint  = '/duration';

  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor(private http: HttpClient) { }


  getTotalTime(days: number, headers: any): Observable<any>{

    return this.http.get(`${this.apiUrl}/${days}`, { headers });

  }

  


}
