import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeadersService } from 'src/app/headers.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = `${environment.API_BASE_URL}/fetchWeeklyReport`; // Replace with your API URL

  constructor(private http: HttpClient, private headersService: HeadersService) {}

  // set Headers 
  // getData(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl, { headers: this.headersService.getHeaders() });

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.headersService.getHeaders() });
  }
}

