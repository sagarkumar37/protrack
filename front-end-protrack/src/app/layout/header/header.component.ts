import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpcodeService } from 'src/app/empcode.service';
import { EmpnameService } from 'src/app/empname.service';
import { HeadersService } from 'src/app/headers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';

  isShown1 = false;
  isShown = false;

  showDashb: boolean = true;
  showAttend: boolean = true;
  // hours_tracked: boolean = false;

  public isVisible = false;
  selectedView: string = 'dashboard';
  empCode: any;
  x: any;
  role2: any;
  admin_report: boolean = false;

  tsFlag: boolean;
  showAdminReport: boolean = false;
  isHod: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private empNameService: EmpnameService,
    private empCodeService: EmpcodeService,
    private headersService: HeadersService
  ) {
    let response: any | null = localStorage.getItem('response');
    response = JSON.parse(response);
    if (response) {
      this.isHod = response.isHod ? response.isHod.hod_id : null;
    }
  }

  headers = this.headersService.getHeaders();

  ngOnInit(): void {
    this.empNameService.fetchEmpName(this.headers).subscribe(
      (data) => {
        this.firstName = data.first_name;
        this.middleName = data.middle_name;
        this.lastName = data.last_name;
      },

      (error) => {
        console.log('Error fetching employee name:', error);
      }
    );

    this.empCodeService.fetchEmpCode().subscribe(
      (data: any) => {
        this.empCode = data.id;
      },
      (error: any) => {
        console.log('Error fetching employee code:', error);
      }
    );
  }

  getFirstChar(data: any) {
    return data.charAt(0);
  }

  logout() {
    this.headersService.removeToken();
    localStorage.clear();
    this.router.navigate(['/login']);
    this.toastr.info('Logout', 'Success!');
  }
}
