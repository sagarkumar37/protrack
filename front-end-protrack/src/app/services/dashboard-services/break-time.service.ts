import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BreakTimeService {

  private apiEndpoint  = '/breaktime';
  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;



  constructor(private http: HttpClient) { }

  getBreakTime(days: number, headers: any): Observable<any>{


      return this.http.get(`${this.apiUrl}/${days}`, { headers});
  }


}
