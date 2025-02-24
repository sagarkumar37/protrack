import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductiveTimeService {

  // private apiUrl = 'http://localhost:3000/productivetime'
  private apiEndpoint  = '/productivetime';

  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor(private http: HttpClient) {}



  getProductiveTime(days: number, headers: any): Observable<any>{



    return this.http.get(`${this.apiUrl}/${days}`, {headers})
  }






}
