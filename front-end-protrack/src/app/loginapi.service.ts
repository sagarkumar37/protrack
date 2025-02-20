import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import{tap} from 'rxjs/operators';  

@Injectable({
  providedIn: 'root'
})
// self code
export class LoginapiService {

  // private loginapiUrl  = "http://localhost:3000/login";

  // private signupApiUrl = "http://localhost:3000/signup";
  // private sample = "http://quick_api:3000/logout";

  private apiEndpoint  = '/login';

  private loginapiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`; 



  constructor(private http: HttpClient) { }



  login(employee_code: string, password: string, loginTime: Date):Observable<any>{
    return this.http.post(this.loginapiUrl, { employee_code, password,loginTime }).pipe(
      tap((response) => {
        // Set the JWT as a cookie
        localStorage.clear()
        
        // const token = this.cookieService.get('token');
        // // Set the token as a cookie
        // this.cookieService.set('token', token, 1);
        localStorage.setItem('response', JSON.stringify(response));


     
})
    );

}

}
