import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private apiUrl = 'https://localhost:3000/TimeEntries';
  private apiEndpoint  = '/TimeEntries';

  private apiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
