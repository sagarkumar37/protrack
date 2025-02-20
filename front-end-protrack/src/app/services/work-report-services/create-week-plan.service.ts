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
export class CreateWeekPlanService {


  
  constructor(private http: HttpClient, private headers: HeadersService) { }


  // weekNumber:number = new Date().getWeekNumber();

  currentDate = moment();
  currentYear = this.currentDate.year();
  currentWeek = this.currentDate.week();

  yearWeek = `${this.currentYear}${this.currentWeek.toString().padStart(2, '0')}`;
  // console.log('consoling yearWeek' + this.yearWeek);


 
  private apiUrl = `${environment.API_BASE_URL}/CreateWeeklyPlan`
  private askapiUrl =`${environment.API_BASE_URL}/api/dropdown_options2`
   createWeekPlan(inputs:any[],year_week:number):Observable<HttpResponse<string>>{

    console.log('this.year +++  '+ this.yearWeek)
    console.log("consoling inputs from service");
    // alert((JSON.stringify(inputs)));
    console.log(inputs);
      // return this.http.post<any>(this.apiUrl, inputs,{headers:this.headers.getHeaders()});
      return this.http.post(`${this.apiUrl}/${year_week}`, inputs, {
        headers: this.headers.getHeaders(),
        observe: 'response', // This tells HttpClient to give you the full response
        responseType: 'text' // Specify that the response type is text
      });
      
  }
  getDropdownData(): Observable<any> {
    return this.http.get<any>(`${this.askapiUrl}`,{  headers: this.headers.getHeaders() });
  }



}
