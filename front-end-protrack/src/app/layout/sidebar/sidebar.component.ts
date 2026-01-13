import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeadersService } from 'src/app/headers.service';
import { FetchUserRoleService } from 'src/app/services/admin-report-services/fetch-user-role.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  firstName: string= '';
  middleName: string= '';
  lastName: string= '';

  isShown1 = false;
  isShown = false;
  

  showDashb: boolean = true;
  showAttend: boolean = true;
  // hours_tracked: boolean = false;

  public isVisible = false;
  selectedView: string = 'dashboard';
  empCode: any;
  x:any;
  role2: any;
  admin_report: boolean =false;

  tsFlag: boolean;
  showAdminReport: boolean = false;
  isHod: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private headersService: HeadersService,
    private empRole: FetchUserRoleService) { 
    let response: any | null= localStorage.getItem("response");
    response= JSON.parse(response);
      if(response){
        this.isHod= response.isHod ? response.isHod.hod_id: null;
      }
    }

    headers = this.headersService.getHeaders();

  ngOnInit(): void {

    const submenuState = localStorage.getItem('isShown1');
    this.isShown1 = submenuState === 'true';
    this.empRole.getEmployeeRole().subscribe(
      response => {
        this.role2 = response.role;
        if(this.role2 == 'admin')
        {
          this.admin_report = true;
        }
      },
      error=> {
        console.error(error);
      }
    );

    this.empRole.getEmployeeRole().subscribe(
      response => {
        this.role2 = response.role;
        if(this.role2 == 'admin')
        {
          this.admin_report = true;
        }
      },
      error=> {
        console.error(error);
      }
    );
  }

  toggleSubMenu() {
    this.isShown = !this.isShown;
  }

  toggleSubMenu1() {
    this.isShown1 = !this.isShown1;
    localStorage.setItem('isShown1', this.isShown1.toString());
  }


  toggleDashb() {
    this.showDashb = !this.showDashb;
  }

  toggleAttend(){
    this.showAttend = !this.showAttend;
  }
  
  // toggling views in sidenav 
  selectView(view: string) {
    this.selectedView = view; 
  }
  

}
