import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  isLoggedin(){
    return !!localStorage.getItem('response');
    // return false;
  }

  getToken(): string {
    let authToken:string = "";
    let json: string | null = localStorage.getItem("response");
    if (json) {
    authToken = JSON.parse(json).token;
   }
    return authToken;
  }

  checkTokenValidity(token: string): Observable<boolean> {
    let url= `${environment.API_BASE_URL}/auth/validate-token`;
    return this.http.post<any>(url, { token });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
} 
