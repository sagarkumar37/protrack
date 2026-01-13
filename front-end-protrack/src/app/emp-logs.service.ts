import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/headers.service';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmpLogsService {
  private apiUrl = `${environment.API_BASE_URL}/employeelogs`;

  constructor(private http: HttpClient, private headers: HeadersService) { }

  getLoginLogs(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${date}`,{headers: this.headers.getHeaders() });
  }
}