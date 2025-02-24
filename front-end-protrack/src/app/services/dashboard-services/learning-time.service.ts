import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LearningTimeService {

  // private apiUrl = 'http://localhost:3000/learningtime';
  private apiEndpoint  = '/learningtime';

  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor( private http: HttpClient) { }



  getLearningtime(days: number, headers: any):Observable<any>{

      return this.http.get(`${this.apiUrl}/${days}`, { headers})
  }
}
