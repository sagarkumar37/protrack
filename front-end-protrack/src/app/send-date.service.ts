


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class SendDateService {

  // private punchInApiUrl  = "http://localhost:3000/punchinTime2";

  private apiEndpoint  = '/punchinTime2';

  private punchInApiUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  // private punchOutApiUrl = "http://localhost:3000/punchoutTime2";

  private apiEndpoint2  = '/punchoutTime2';

  private punchOutApiUrl = `${environment.API_BASE_URL}${this.apiEndpoint2}`;
  private api: any;


  constructor(private http: HttpClient) { }

  postDate(punchInTime: Date) :Observable<any>{

    
    let token:string ="";
    let json: string | null = localStorage.getItem("response");
      if (json) {
        console.log("json "+json);
      token = JSON.parse(json).token;
       console.log(token);
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    console.log("this is header "+ headers.Authorization)
    return this.http.post<any[]>(this.punchInApiUrl, {punchInTime},{ headers });
    

    
  }  

  postDate2(punchOutTime: Date) :Observable<any>{
    // const token = this.getCookieValue('token');
    let token:string ="";
    let json: string | null = localStorage.getItem("response");
      if (json) {
        console.log("json "+json);
      token = JSON.parse(json).token;
       console.log(token);
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    console.log("this is header "+ headers.Authorization)

    return this.http.post<any[]>(this.punchOutApiUrl, {punchOutTime},{ headers });

    
  }   
}

