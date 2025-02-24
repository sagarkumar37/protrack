import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// self code
export class TimeEntryServiceService {


  // private baseUrl = 'http://localhost:3000/timeEntries'; // replace with your backend API endpoint

  private apiEndpoint  = '/timeEntries';

  private baseUrl = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor(private http: HttpClient) { }

  // fetch the time entries for an employee from the backend
  getTimeEntriesForEmployee(empCode: string): Observable<any> {

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


    return this.http.get<any>(this.baseUrl, { headers }).pipe(
      map((response) => response.data) // extract the data property from the response
    );
  }
}
