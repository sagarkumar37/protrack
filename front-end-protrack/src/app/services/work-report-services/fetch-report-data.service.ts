import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/headers.service';


@Injectable({
  providedIn: 'root'
})
export class FetchReportDataService {

  constructor(
    private http:     HttpClient,
    private headers:  HeadersService
  ) { }



  fetchTaskDetails(year_week:number) :Observable<any>{
    let apiUrl = `${environment.API_BASE_URL}/fetchPreviousWeekDetails/${year_week}`;
    console.log(apiUrl);

      return this.http.get<any>(apiUrl , {headers: this.headers.getHeaders()});
  }

  // adminfetchTaskDetails(date: Date, username: string) : Observable<any>{
  //   let apiUrl = `${environment.API_BASE_URL}`
  //   const payload ={
  //     weekDate,

  //   }
  //   return this.fetchTaskDetails.get<any>(`${}`)
  // }

  adminFetchTaskDetails(startDate:Date,endDate: Date, userName:string[]): Observable<any>{

    const payload = {
      startDate,
      endDate,
      userName
    }


    // alert(` Payload ${JSON.stringify(payload)}`)
    let apiUrl = `${environment.API_BASE_URL}/adminfetchPreviousWeekDetails`;
    return this.http.post<any>(`${apiUrl}`,payload,{headers: this.headers.getHeaders()});
  }

  FetchTaskDetails(startDate:Date,endDate: Date): Observable<any>{

    const payload = {
      startDate,
      endDate,
      
    }


    // alert(` Payload ${JSON.stringify(payload)}`)
    let apiUrl = `${environment.API_BASE_URL}/fetchSingleEmployeeReport`;
    return this.http.post<any>(`${apiUrl}`,payload,{headers: this.headers.getHeaders()});
  }


  adminFetchEmployees(): Observable<any>{
    let apiUrl = `${environment.API_BASE_URL}/fetchEmployees`
    return this.http.get<any>(`${apiUrl}`,{headers: this.headers.getHeaders()})
  }



    
}
