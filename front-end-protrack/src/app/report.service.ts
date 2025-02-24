
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ReportService {


  // private reportApiUrl = "http://localhost:9999/report";
  constructor(private http: HttpClient) { }

  // getData2() :Observable<any>{
    // const token = this.getCookieValue('token');
//     let token:string ="";
//     let json: string | null = localStorage.getItem("response");
//       if (json) {
//         console.log("json "+json);
//       token = JSON.parse(json).token;
//        console.log(token);
// }

//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     };
//     console.log("this is header "+ headers.Authorization)
//     return this.http.post<any[]>(this.reportApiUrl, {},{ headers });
  // }  

 



  
  

}

