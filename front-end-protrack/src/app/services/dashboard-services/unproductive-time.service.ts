import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnproductiveTimeService {

  // private apiUrl = 'http://localhost:3000/unproductivetime'
  private apiEndpoint  = '/unproductivetime';


  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;
  constructor( private http: HttpClient) { }



  getUnproductiveTime(days:number, headers:any): Observable<any>{

    return this.http.get(`${this.apiUrl}/${days}`, { headers });
  }
}
