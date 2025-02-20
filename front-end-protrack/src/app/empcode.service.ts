import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeadersService } from './headers.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class EmpcodeService {

  // private readonly BASE_URL = 'http://localhost:3000/fetchempcode';
  private apiEndpoint  = '/fetchempcode';

  private BASE_URL = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor(private headersService: HeadersService , private http: HttpClient){}

  headers = this.headersService.getHeaders();

  fetchEmpCode(headers: any): Observable<any>{
    return this.http.get(`${this.BASE_URL}`, { headers });

  }

  
}






// example  for injecting this service in other components: (name of service is incorrect)

// import { Component, OnInit } from '@angular/core';
// import { EmployeeService } from './employee.service';

// @Component({
//   selector: 'app-my-component',
//   template: '<p>{{ empCode }}</p>'
// })
// export class MyComponent implements OnInit {

//   empCode: string;

//   constructor(private employeeService: EmployeeService) { }

//   ngOnInit() {
//     this.employeeService.fetchEmpCode().subscribe(
//       data => {
//         this.empCode = data.id;
//       },
//       error => {
//         console.log('Error fetching employee code:', error);
//       }
//     );
//   }

// }

