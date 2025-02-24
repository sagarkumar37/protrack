import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchPunchoutTimeService {

  // private apiUrl = "http://localhost:3000/fetchpunchinout";
  private apiEndpoint  = '/fetchpunchinout';

  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;


  constructor(private http:HttpClient) {

   }

   fetchPunchoutTime(headers:any):Observable<any>{
    return this.http.get<any>(this.apiUrl, {headers});

   }
}
