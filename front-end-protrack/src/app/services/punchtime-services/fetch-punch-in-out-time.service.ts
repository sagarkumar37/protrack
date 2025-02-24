import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FetchPunchInOutTimeService {

  constructor(private http:HttpClient) { }

  fetchPunchInOut(headers:any):Observable<any>{
   return this.http.get(`${environment.API_BASE_URL}/fetchPunchInOut`,{headers});
  }
}
