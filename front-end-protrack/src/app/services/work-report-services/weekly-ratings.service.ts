import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from 'src/app/headers.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeeklyRatingsService {

  constructor(private http: HttpClient,private header: HeadersService) { }

  private apiUrl = `${environment.API_BASE_URL}/createWeeklyRating`;

  createWeeklyRatings(weekly_ratings :any,year_week:number) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/${year_week}`,weekly_ratings,{headers: this.header.getHeaders()});
  }

  

  


}
