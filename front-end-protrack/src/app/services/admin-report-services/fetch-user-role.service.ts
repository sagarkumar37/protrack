import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/headers.service';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FetchUserRoleService {
  constructor(private http: HttpClient,private headersService:HeadersService) { }
  getEmployeeRole():Observable<any>{
   const  headers = this.headersService.getHeaders();
   const apiUrl = environment.API_BASE_URL + '/checkEmployeeRole';

    return this.http.get<any>(apiUrl,{headers})
  }

  getEmployeeRole2(): Observable<any> {
    // Mock response with role 'admin'
    return of({ role: 'admin' });
  }
}
