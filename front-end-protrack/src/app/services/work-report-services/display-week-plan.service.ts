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
export class DisplayPlanService{
    constructor(private http: HttpClient, private headers: HeadersService) { }
    private apiUrl = `${environment.API_BASE_URL}/fetchplans`
    private secondapiUrl =`${environment.API_BASE_URL}/updateplans`
    
    displayplans(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`, {headers: this.headers.getHeaders() });
      }
      updatePlans( planIds: number[], status: string): Observable<any> {
        const body = { planIds, status };
        return this.http.put(`${this.secondapiUrl}`, body, { headers:this.headers.getHeaders() });
      }
    }
    
