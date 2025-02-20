import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IdleMinutesService {

  constructor(private http: HttpClient) { }

  //  apiUrl = 'http://localhost:3000/idleminutes';
   private apiEndpoint  = '/idleminutes';

   private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;
                   

  

  getIdleMinutes(days: number, headers: any):Observable<any>{


    return this.http.get(`${this.apiUrl}/${days}`, {headers});

  }
}
