import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/headers.service';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FetchTasksService {

  private apiUrl = `${environment.API_BASE_URL}/fetchWeeklyActivities`

  private apiUrlTask = `${environment.API_BASE_URL}/fetchTaskDescription`

  constructor(private http: HttpClient, private headerService:HeadersService) { }

  fetchActivities(year_week:number):Observable<any>{ 
    return this.http.get<any>(`${this.apiUrl}/${year_week}`,{  headers: this.headerService.getHeaders() });
  }

  fetchTasks():Observable<any>{
    return this.http.get<any>(`${this.apiUrlTask}`, { headers: this.headerService.getHeaders()});
  }

  

  private desApiUrl = `${environment.API_BASE_URL}/fetchDescription`
  fetchTasksDescription(activity:string,year_week:number):Observable<any>{
    const requestBody= {activity:activity, year_week:year_week};
    return this.http.post<any>(`${this.desApiUrl}/${year_week}`, requestBody,{headers:this.headerService.getHeaders()});
  }
}
