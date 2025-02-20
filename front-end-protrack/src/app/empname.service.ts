import { Injectable } from '@angular/core';
import { HeadersService } from './headers.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
// self code
export class EmpnameService {
  
  // private readonly BASE_URL = 'http://localhost:3000/fetchempname';
  private apiEndpoint  = '/fetchempname';

  private BASE_URL = `${environment.API_BASE_URL}${this.apiEndpoint}`;

  constructor(private headersService: HeadersService , private http: HttpClient){}

  headers = this.headersService.getHeaders();

  fetchEmpName(headers: any):Observable<any>{
    return this.http.get(`${this.BASE_URL}`, { headers });
  }

}



// Example for injecting this service to other component:

// import { Component, OnInit } from '@angular/core';
// import { EmployeeService } from './employee.service';

// @Component({
//   selector: 'app-my-component',
//   template: '<p>{{ firstName }} {{ middleName }} {{ lastName }}</p>'
// })
// export class MyComponent implements OnInit {

//   firstName: string;
//   middleName: string;
//   lastName: string;

//   constructor(private employeeService: EmployeeService) { }

//   ngOnInit() {
//     this.employeeService.fetchEmpName().subscribe(
//       data => {
//         this.firstName = data.first_name;
//         this.middleName = data.middle_name;
//         this.lastName = data.last_name;
//       },
//       error => {
//         console.log('Error fetching employee name:', error);
//       }
//     );
//   }

// }
