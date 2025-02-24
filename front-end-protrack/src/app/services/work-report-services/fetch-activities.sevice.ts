import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/headers.service';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FetchAcytivitiesService {

  private apiUrl = `${environment.API_BASE_URL}/api/dropdown_options2`


  constructor(private http: HttpClient, private headerService:HeadersService) { }

  getDropdownData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`,{  headers: this.headerService.getHeaders() });
  }
  
}
