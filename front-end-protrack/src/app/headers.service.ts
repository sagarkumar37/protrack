import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

// self code
export class HeadersService {
   token: string = '';
  
  constructor() { 
    const json: string | null = localStorage.getItem("response");
    if (json) {
      this.token = JSON.parse(json).token;
    }
  }

  
  
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }


  setToken(token: string) {
    this.token = token;
  }


  removeToken() {
    this.token = '';
  }

}